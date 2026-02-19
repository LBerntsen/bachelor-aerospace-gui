import csv
import time
from pathlib import Path


INPUT_FILE = Path("data.csv")
OUTPUT_FILE = Path("output.csv")
DELAY = 0.01


def copy_csv(input_path: Path, output_path: Path, delay: float = 0.0) -> None:
    """Copy rows from one CSV file to another, closing the file after each write."""

    output_path.write_text("", encoding="utf-8")

    with input_path.open("r", newline="", encoding="utf-8") as infile:
        reader = csv.reader(infile)

        for row in reader:
            with output_path.open("a", newline="", encoding="utf-8") as outfile:
                writer = csv.writer(outfile)
                writer.writerow(row)

            print(row)

            if delay:
                time.sleep(delay)


def main() -> None:
    copy_csv(INPUT_FILE, OUTPUT_FILE, DELAY)
    print("Data copied successfully!")


if __name__ == "__main__":
    main()
