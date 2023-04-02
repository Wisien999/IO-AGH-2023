from datetime import datetime
from min_dalle import MinDalle
from multiprocessing.connection import Listener, Client
import threading
import torch
from queue import Queue

def generate_image(model: MinDalle, prompt: str) -> str:
    image = model.generate_image(
        text=prompt,
        seed=2137,
        grid_size=1,
        is_seamless=False,
        temperature=1,
        top_k=256,
        supercondition_factor=16,
        is_verbose=False
    )
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    image.save(f'images/{timestamp}.png')
    return f'images/{timestamp}.png'

def listen(queue: Queue):
    address = ('localhost', 6000)
    listener = Listener(address, authkey=b'secret password')
    while True:
        conn = listener.accept()
        print('connection accepted from', listener.last_accepted)
        while True:
            prompts, address = conn.recv()
            print(f'Got prompts: {prompts}')
            queue.put((prompts, address))

def send(model: MinDalle, queue: Queue):
    while True:
        prompts, address = queue.get(block=True)
        pictures = []
        for prompt in prompts:
            print(f'Generating image for prompt: {prompt}')
            pictures.append(generate_image(model, prompt))
        client = Client(address, authkey=b'secret password')
        print(f'Sending pictures: {pictures} to {address}')
        client.send(pictures)
        client.close()


if __name__ == '__main__':
    model = MinDalle(
        models_root='./pretrained',
        dtype=torch.float16,
        device='cuda',
        is_mega=False,
        is_reusable=True,
    )
    prompts = Queue()
    # start the listener thread
    listener_thread = threading.Thread(target=listen, args=(prompts,))
    listener_thread.start()

    # start the sender thread
    sender_thread = threading.Thread(target=send, args=(model, prompts,))
    sender_thread.start()

    print("ready")




