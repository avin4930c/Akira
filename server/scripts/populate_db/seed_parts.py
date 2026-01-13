import sys
from pathlib import Path
import random
import asyncio

current_dir = Path(__file__).resolve().parent
server_dir = current_dir.parent.parent
sys.path.append(str(server_dir))

from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import text
from app.core.database import async_engine
from app.model.sql_models.mia import PartInventory
from app.clients.embedding_clients.lmstudio_embedding_client import (
    get_lmstudio_embedding_client,
)
from app.config.logger_config import setup_logger

log = setup_logger(__name__)


async def ensure_tables_exist():
    """Create the PartInventory table and enable pgvector extension if needed."""
    async with async_engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(
            lambda sync_conn: SQLModel.metadata.create_all(
                sync_conn, tables=[PartInventory.__table__]
            )
        )
    log.info("Ensured PartInventory table exists with pgvector extension.")


def create_embedding_text(part: dict) -> str:
    """Create a rich text representation of the part for embedding.
    
    Combines name, description, and compatible models to create a 
    comprehensive text that captures the part's semantic meaning.
    """
    name = part.get("name", "")
    description = part.get("description", "")
    compatible = ", ".join(part.get("compatible_models", []))
    
    parts = [name]
    if description:
        parts.append(description)
    if compatible:
        parts.append(f"Compatible with: {compatible}")
    
    return ". ".join(parts)


def embed_parts_batch(
    parts_data: list[dict],
    *,
    batch_size: int = 20,
) -> list[list[float]]:
    """Generate embeddings for all parts in batches."""
    embedding_client = get_lmstudio_embedding_client()
    client = embedding_client.get_embedding_client()

    texts = [create_embedding_text(p) for p in parts_data]
    all_embeddings = []

    total_batches = (len(texts) - 1) // batch_size + 1

    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        batch_num = i // batch_size + 1

        log.info(f"Embedding batch {batch_num}/{total_batches} ({len(batch)} parts)...")

        embeddings = client.embed_documents(batch)
        all_embeddings.extend(embeddings)

    log.info(f"Generated {len(all_embeddings)} embeddings.")
    return all_embeddings

async def seed_parts():
    parts_data = [
        {'part_code': '20K1110S', 'name': 'CHAIN SPROCKET KIT (HF DWN / HF DLX)', 'stock_quantity': 0, 'unit_price': 737.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A complete set containing the front and rear sprockets along with the drive chain, essential for transferring engine power to the rear wheel.'},
        {'part_code': '29K210S', 'name': 'SPEEDOMETER DRIVE KIT', 'stock_quantity': 0, 'unit_price': 50.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'The mechanism located at the wheel hub that measures wheel rotation speed and transmits it to the speedometer gauge.'},
        {'part_code': '30K410S', 'name': 'CHAIN COVER KIT', 'stock_quantity': 0, 'unit_price': 387.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A protective casing that encloses the drive chain, preventing dirt and debris accumulation while protecting the rider from moving parts.'},
        {'part_code': 'K06431KTCF981S', 'name': 'KIT, BRAKE SHOE', 'stock_quantity': 0, 'unit_price': 290.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A set of friction linings used in drum brake systems to create the necessary drag against the drum for stopping the motorcycle.'},
        {'part_code': 'K06431KTNA701S', 'name': 'KIT, BRAKE SHOE', 'stock_quantity': 0, 'unit_price': 271.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A set of friction linings used in drum brake systems to create the necessary drag against the drum for stopping the motorcycle.'},
        {'part_code': 'K06451KCCA900S', 'name': 'KIT, BRAKE SHOE', 'stock_quantity': 0, 'unit_price': 188.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A set of friction linings used in drum brake systems to create the necessary drag against the drum for stopping the motorcycle.'},
        {'part_code': 'K10123HF100DS', 'name': 'KIT, CAP TAPPET', 'stock_quantity': 0, 'unit_price': 90.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'Covers for the valve tappets that seal the cylinder head access points, preventing oil leaks and protecting the valve mechanism.'},
        {'part_code': 'K11113AAHB000S', 'name': 'FSC KIT (1st/3rd)', 'stock_quantity': 0, 'unit_price': 115.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'Full Service Card kit likely containing maintenance parts or gaskets specifically for the 1st and 3rd service intervals.'},
        {'part_code': 'K11113AAHB001', 'name': 'FSC KIT (5th) 100CC', 'stock_quantity': 0, 'unit_price': 447.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'Full Service Card kit containing specific maintenance components required for the 5th scheduled service of a 100cc engine.'},
        {'part_code': 'K13130AAFF400S', 'name': 'KIT, PISTON RING (0.25)', 'stock_quantity': 0, 'unit_price': 636.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A set of oversized piston rings (0.25mm) used when the engine cylinder has been rebored to a slightly larger diameter.'},
        {'part_code': 'K13130AAFF410S', 'name': 'KIT, PISTON RING (0.50)', 'stock_quantity': 0, 'unit_price': 636.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A set of oversized piston rings (0.50mm) used for engines with cylinders rebored to a larger second-oversize diameter.'},
        {'part_code': 'K14144AACK000S', 'name': 'KIT CAM CHAIN', 'stock_quantity': 0, 'unit_price': 424.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'Contains the timing chain which synchronizes the rotation of the crankshaft and camshaft to ensure proper valve timing.'},
        {'part_code': 'K14144AADA000S', 'name': 'KIT HALF CAM CHAIN 100CC', 'stock_quantity': 0, 'unit_price': 304.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A partial replacement kit for the cam chain system, likely including the chain itself without tensioners or guides, for 100cc engines.'},
        {'part_code': 'K14144AADE303S', 'name': 'CAM CHAIN KIT', 'stock_quantity': 0, 'unit_price': 340.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A comprehensive kit for the timing system, typically including the cam chain, tensioner, and guides to restore precise valve timing.'},
        {'part_code': 'K14144AAEE300S', 'name': 'KIT, CAM CHAIN', 'stock_quantity': 0, 'unit_price': 396.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'Contains the timing chain which synchronizes the rotation of the crankshaft and camshaft to ensure proper valve timing.'},
        {'part_code': 'K14145HF100DS', 'name': 'PUSH ROD KIT', 'stock_quantity': 0, 'unit_price': 119.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'Components for the push rod assembly that transfers motion from the camshaft to the valves in overhead valve engines.'},
        {'part_code': 'K14146AACA000S', 'name': 'ROLLER KIT', 'stock_quantity': 0, 'unit_price': 108.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'Likely refers to cam chain guide rollers or tensioner rollers that help guide the timing chain and maintain proper tension.'},
        {'part_code': 'K22228HF100DS', 'name': 'KIT, LEVER O-RING', 'stock_quantity': 0, 'unit_price': 69.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A set of O-ring seals used in brake or clutch lever assemblies to prevent grease leakage and keep out dirt.'},
        {'part_code': 'K40405AACA000S', 'name': 'L CHAIN ADJUSTER KIT', 'stock_quantity': 0, 'unit_price': 19.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'The left-side mechanism used to adjust the tension of the drive chain, ensuring it is neither too loose nor too tight.'},
        {'part_code': 'K40405KWAG930S', 'name': 'CHAIN COVER KIT', 'stock_quantity': 0, 'unit_price': 470.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A protective casing that encloses the drive chain, preventing dirt and debris accumulation while protecting the rider from moving parts.'},
        {'part_code': 'K41412KSTG940S', 'name': 'SPROCKET SET PART A FOR 20B1110S', 'stock_quantity': 0, 'unit_price': 368.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A specific sub-assembly or component of the sprocket system, designated for a particular model variant or part number.'},
        {'part_code': 'K41412KSTG941S', 'name': 'KIT, CHAIN SPROCKET', 'stock_quantity': 0, 'unit_price': 760.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A complete set containing the front and rear sprockets along with the drive chain, essential for transferring engine power to the rear wheel.'},
        {'part_code': 'K41412KSTG943S', 'name': 'KIT, CHAIN SPROCKET', 'stock_quantity': 0, 'unit_price': 765.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A complete set containing the front and rear sprockets along with the drive chain, essential for transferring engine power to the rear wheel.'},
        {'part_code': 'K42426AAEF400S', 'name': 'KIT, WHEEL COMP REAR', 'stock_quantity': 0, 'unit_price': 4839.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A complete rear wheel assembly, typically including the rim, spokes, and hub, ready for tire installation.'},
        {'part_code': 'K44446AAFB000S', 'name': 'KIT, WHEEL COMP. FRONT', 'stock_quantity': 0, 'unit_price': 4194.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A complete front wheel assembly, typically including the rim, spokes, and hub, ready for tire installation.'},
        {'part_code': 'K53531HF100DS', 'name': 'KIT, HANDLE RUBBER', 'stock_quantity': 0, 'unit_price': 55.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'Replacement rubber grips for the handlebars, providing comfort and a secure hold for the rider.'},
        {'part_code': 'K53532AAEE300S', 'name': 'BALL RACES KIT', 'stock_quantity': 0, 'unit_price': 350.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A set of bearings and races for the steering stem, allowing smooth and precise steering movement.'},
        {'part_code': 'K90904HF100DS', 'name': 'KIT, GEAR BOX WASHER', 'stock_quantity': 0, 'unit_price': 73.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A collection of specific washers used within the transmission gearbox to ensure proper spacing and operation of gears.'},
        {'part_code': 'K91902HF100DS', 'name': 'KIT, TAPPET ADJ SCREW', 'stock_quantity': 0, 'unit_price': 67.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'Screws and locknuts used to adjust the valve clearance (tappet gap) for optimal engine performance.'},
        {'part_code': 'K91912AAEE300S', 'name': 'KIT, OIL SEAL', 'stock_quantity': 0, 'unit_price': 82.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A comprehensive set of oil seals for the engine to prevent oil leakage from various rotating shafts like the crankshaft and shifter.'},
        {'part_code': 'K96960HF100DRS', 'name': 'KIT, CRANK COVER BOLT', 'stock_quantity': 0, 'unit_price': 75.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A set of bolts specifically designed for securing the crankcase covers, ensuring a tight seal for the engine block.'},
        {'part_code': 'K96961HF100DS', 'name': 'KIT, ENGINE BEARING', 'stock_quantity': 0, 'unit_price': 460.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A set of main bearings used to support the crankshaft and other rotating shafts within the engine.'},
        {'part_code': 'K96961HF100RRS', 'name': 'KIT, WHEEL BEARING', 'stock_quantity': 0, 'unit_price': 230.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'Bearings installed in the wheel hubs to allow the wheels to rotate smoothly with minimal friction.'},
        {'part_code': 'K99991AAEMA10RS', 'name': 'KIT STRIPE BEETLE RED', 'stock_quantity': 0, 'unit_price': 899.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A decal or sticker set in \'Beetle Red\' color scheme for restoring or customizing the motorcycle\'s bodywork graphics.'},
        {'part_code': 'K99991AAEMA20RS', 'name': 'KIT STRIPE FIREFLY GOLDEN', 'stock_quantity': 0, 'unit_price': 899.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A decal or sticker set in \'Firefly Golden\' color scheme for restoring or customizing the motorcycle\'s bodywork graphics.'},
        {'part_code': 'K99991AAEMA30RS', 'name': 'KIT STRIPE BUMBLE BEE YELLOW', 'stock_quantity': 0, 'unit_price': 899.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A decal or sticker set in \'Bumble Bee Yellow\' color scheme for restoring or customizing the motorcycle\'s bodywork graphics.'},
        # Common Service Parts
        {'part_code': '17211AAH1000S', 'name': 'ELEMENT AIR CLEANER', 'stock_quantity': 0, 'unit_price': 230.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'The air filter element that removes dust and debris from the air intake before it enters the engine combustion chamber.'},
        {'part_code': '31916KWA9200S', 'name': 'SPARK PLUG (CHAMPION-P-RZ9HC)', 'stock_quantity': 0, 'unit_price': 125.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'An electrical device that ignites the compressed fuel-air mixture in the engine cylinder to produce power.'},
        {'part_code': '22201GF60000S', 'name': 'DISK CLUTCH FRICTION', 'stock_quantity': 0, 'unit_price': 480.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'Friction plates used in the clutch assembly to engage and disengage power transmission from the engine to the gearbox.'},
        {'part_code': '90000KWA0000S', 'name': 'HERO 4T PLUS ENGINE OIL (900ML)', 'stock_quantity': 0, 'unit_price': 390.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'High-quality 4-stroke engine lubricant designed to reduce friction, cool engine parts, and clean internal components.'},
        {'part_code': '17910KVH9000S', 'name': 'CABLE COMP THROTTLE', 'stock_quantity': 0, 'unit_price': 185.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'The complete throttle cable assembly connecting the handlebar grip to the carburetor for controlling engine speed.'},
        {'part_code': '22870KVH9000S', 'name': 'CABLE COMP CLUTCH', 'stock_quantity': 0, 'unit_price': 160.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'The complete clutch cable assembly connecting the handlebar lever to the clutch mechanism for gear changes.'},
        {'part_code': '45450KVH9000S', 'name': 'CABLE COMP FR BRAKE', 'stock_quantity': 0, 'unit_price': 165.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'The complete front brake cable assembly connecting the handlebar lever to the front drum brake mechanism.'},
        {'part_code': '34901KSP9100S', 'name': 'BULB HEADLIGHT (12V 35/35W)', 'stock_quantity': 0, 'unit_price': 145.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A dual-filament headlight bulb providing both low and high beam illumination for night riding.'},
        {'part_code': '33400KWA9300S', 'name': 'WINKER ASSY R FR', 'stock_quantity': 0, 'unit_price': 210.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'The complete right-front turn signal (indicator) assembly, including the housing, lens, and bulb.'},
        {'part_code': '31500KWA9400S', 'name': 'BATTERY (12V 3AH MF)', 'stock_quantity': 0, 'unit_price': 1250.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'A 12-volt, 3-amp-hour Maintenance Free battery that powers the electrical starter, lights, and horn.'},
        {'part_code': '88110KWA9500S', 'name': 'MIRROR ASSY R BACK', 'stock_quantity': 0, 'unit_price': 180.0, 'compatible_models': ['SPLENDOR PLUS OBD2B(Apr., 2025)'], 'description': 'The complete right-side rearview mirror assembly to provide visibility of traffic behind the rider.'},
    ]

    log.info(f"Preparing to seed {len(parts_data)} parts...")
    
    await ensure_tables_exist()
    
    log.info("Generating embeddings for all parts...")
    embeddings = await asyncio.to_thread(embed_parts_batch, parts_data)
    
    if len(embeddings) != len(parts_data):
        raise RuntimeError(
            f"Embedding count mismatch: got {len(embeddings)}, expected {len(parts_data)}"
        )

    async with AsyncSession(async_engine) as session:
        for part, embedding in zip(parts_data, embeddings):
            part['stock_quantity'] = random.randint(5, 50)
            part['embedding'] = embedding

            statement = insert(PartInventory).values(**part)
            statement = statement.on_conflict_do_update(
                index_elements=['part_code'],
                set_={
                    'name': statement.excluded.name,
                    'unit_price': statement.excluded.unit_price,
                    'compatible_models': statement.excluded.compatible_models,
                    'stock_quantity': statement.excluded.stock_quantity,
                    'description': statement.excluded.description,
                    'embedding': statement.excluded.embedding,
                }
            )
            await session.exec(statement)
        await session.commit()
        log.info("Part inventory seeded successfully.")

if __name__ == "__main__":
    asyncio.run(seed_parts())