from datetime import datetime
from min_dalle import MinDalle

import torch
model = MinDalle(
    models_root='./pretrained',
    dtype=torch.float16,
    device='cuda',
    is_mega=False,
    is_reusable=True
)

def generate_image(model: MinDalle, prompt: str) -> str:
    image = model.generate_image(
        text=prompt,
        seed=-1,
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

if __name__ == '__main__':
    print(generate_image(model, 'a dog'))