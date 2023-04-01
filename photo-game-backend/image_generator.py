from datetime import datetime
from min_dalle import MinDalle


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

