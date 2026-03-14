import random

from fastapi import APIRouter

from app.schemas import QuoteResponse

router = APIRouter(prefix="/api/quotes", tags=["quotes"])

QUOTES: list[QuoteResponse] = [
    # How I Met Your Mother
    QuoteResponse(
        text="If you're not scared, you're not taking a chance. And if you're not taking a chance, then what the hell are you doing?",
        source="How I Met Your Mother",
        character="Ted Mosby",
    ),
    QuoteResponse(
        text="You will be shocked, kids, when you discover how easy it is in life to part ways with people forever. That's why, when you find someone you want to keep around, you do something about it.",
        source="How I Met Your Mother",
        character="Ted Mosby",
    ),
    QuoteResponse(
        text="Love is the best thing we do.",
        source="How I Met Your Mother",
        character="Ted Mosby",
    ),
    QuoteResponse(
        text="Sometimes things have to fall apart to make way for better things.",
        source="How I Met Your Mother",
        character="Ted Mosby",
    ),
    # The Summer I Turned Pretty
    QuoteResponse(
        text="It wasn't the way you fell into someone's arms. It was slow, like wading into the ocean.",
        source="The Summer I Turned Pretty",
        character="Belly",
    ),
    QuoteResponse(
        text="I think I've been holding myself back from falling in love again. And I don't want to hold back anymore.",
        source="The Summer I Turned Pretty",
        character="Belly",
    ),
    QuoteResponse(
        text="It's always been you. Even when I didn't want it to be, even when it broke my heart, it was always you.",
        source="The Summer I Turned Pretty",
        character="Jeremiah",
    ),
    # Stuck in Love
    QuoteResponse(
        text="The only way you can write the truth is to assume that what you put down will never be read.",
        source="Stuck in Love",
        character="Bill Borgens",
    ),
    QuoteResponse(
        text="I remember that it hurt. Looking at her hurt.",
        source="Stuck in Love",
        character="Rusty Borgens",
    ),
    QuoteResponse(
        text="My biggest mistake was thinking you could fix me. Only I can fix me.",
        source="Stuck in Love",
        character="Samantha Borgens",
    ),
    # The Perks of Being a Wallflower
    QuoteResponse(
        text="We accept the love we think we deserve.",
        source="The Perks of Being a Wallflower",
        character="Mr. Anderson",
    ),
    QuoteResponse(
        text="And in that moment, I swear we were infinite.",
        source="The Perks of Being a Wallflower",
        character="Charlie",
    ),
    QuoteResponse(
        text="So I guess we are who we are for a lot of reasons. And maybe we'll never know most of them.",
        source="The Perks of Being a Wallflower",
        character="Charlie",
    ),
    QuoteResponse(
        text="Things change. And friends leave. Life doesn't stop for anybody.",
        source="The Perks of Being a Wallflower",
        character="Charlie",
    ),
    # Trying (Apple TV+)
    QuoteResponse(
        text="I think the bravest thing you can do is just try.",
        source="Trying",
        character="Nikki",
    ),
    QuoteResponse(
        text="You don't need a plan. You just need to be brave.",
        source="Trying",
        character="Jason",
    ),
    QuoteResponse(
        text="The good stuff is always worth waiting for, even when the waiting is hard.",
        source="Trying",
        character="Nikki",
    ),
    # Dead Poets Society
    QuoteResponse(
        text="Carpe diem. Seize the day, boys. Make your lives extraordinary.",
        source="Dead Poets Society",
        character="John Keating",
    ),
    QuoteResponse(
        text="We don't read and write poetry because it's cute. We read and write poetry because we are members of the human race.",
        source="Dead Poets Society",
        character="John Keating",
    ),
    QuoteResponse(
        text="But only in their dreams can men be truly free. 'Twas always thus, and always thus will be.",
        source="Dead Poets Society",
        character="John Keating",
    ),
    # Before Sunrise
    QuoteResponse(
        text="I believe if there's any kind of God, it wouldn't be in any of us. Not you or me... but just this little space in between.",
        source="Before Sunrise",
        character="Celine",
    ),
    QuoteResponse(
        text="Isn't everything we do in life a way to be loved a little more?",
        source="Before Sunrise",
        character="Celine",
    ),
    # Before Sunset
    QuoteResponse(
        text="I guess when you're young, you just believe there'll be many people with whom you'll connect. Later in life you realize it only happens a few times.",
        source="Before Sunset",
        character="Celine",
    ),
    QuoteResponse(
        text="Even being alone, it's better than sitting next to a lover and feeling lonely.",
        source="Before Sunset",
        character="Celine",
    ),
    # Before Midnight
    QuoteResponse(
        text="If you want true love, then this is it. This is real life. It's not perfect, but it's real.",
        source="Before Midnight",
        character="Jesse",
    ),
]


@router.get("/random", response_model=QuoteResponse)
async def random_quote() -> QuoteResponse:
    return random.choice(QUOTES)


@router.get("", response_model=list[QuoteResponse])
async def all_quotes() -> list[QuoteResponse]:
    return QUOTES
