from pydantic import BaseModel
from datetime import datetime, timezone, timedelta


class GameTime(BaseModel):
    start: str
    current: str
    end: str

    @staticmethod
    def from_current_time(time_to_end: int):
        return GameTime(
            start=str(datetime.now(timezone.utc)),
            current=str(datetime.now(timezone.utc)),
            end=str(datetime.now(timezone.utc) + timedelta(seconds=time_to_end))
        )

    def update(self):
        self.current = str(datetime.now(timezone.utc))

    def is_timeout(self):
        return self.current >= self.end

     