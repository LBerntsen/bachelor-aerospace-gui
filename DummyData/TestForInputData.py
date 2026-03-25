import csv
import time
from pathlib import Path
from datetime import datetime, timezone, timedelta

INPUT_FILE = Path("data_rewritten_fuel_sparse.csv")
OUTPUT_FILE = Path("output.csv")
DELAY = 0.01

def get_current_timestamp():
    """Genererer nåværende tid i ISO 8601 format med tidssone (f.eks. +02:00)."""
    # Bruker local time for å matche ditt format (+02:00)
    now = datetime.now().astimezone()
    return now.isoformat()

def copy_csv(input_path: Path, output_path: Path, delay: float = 0.0) -> None:
    """Copy rows from one CSV file to another, replacing the timestamp."""

    output_path.write_text("", encoding="utf-8")

    with input_path.open("r", newline="", encoding="utf-8") as infile:
        # Vi bruker semicolon som skilletegn siden filen din bruker det
        reader = csv.reader(infile, delimiter=';')
        
        # Hent headeren først for å unngå å endre ordet "Tidspunkt"
        header = next(reader)
        with output_path.open("a", newline="", encoding="utf-8") as outfile:
            writer = csv.writer(outfile, delimiter=';')
            writer.writerow(header)

        for row in reader:
            if not row:
                continue
            
            # Oppdater første kolonne (indeks 0) med nytt tidsstempel
            row[0] = get_current_timestamp()

            with output_path.open("a", newline="", encoding="utf-8") as outfile:
                writer = csv.writer(outfile, delimiter=';')
                writer.writerow(row)

            print(f"Skrev rad med ny tid: {row[0]}")

            if delay:
                time.sleep(delay)

def main() -> None:
    if not INPUT_FILE.exists():
        print(f"Feil: Finner ikke {INPUT_FILE}")
        return
        
    copy_csv(INPUT_FILE, OUTPUT_FILE, DELAY)
    print("Data kopiert med oppdaterte tidsstempler!")

if __name__ == "__main__":
    main()