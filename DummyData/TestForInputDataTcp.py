import csv
import socket
import time
from pathlib import Path
from datetime import datetime

INPUT_FILE = Path("data_rewritten_fuel_sparse.csv")
SERVER_IP = '127.0.0.1' 
PORT = 8088
DELAY = 0.01

def get_current_timestamp():
    return datetime.now().astimezone().isoformat()

def run_sender():
    if not INPUT_FILE.exists():
        print(f"Feil: Finner ikke {INPUT_FILE}")
        return

    print(f"Kobler til C# server på {SERVER_IP}:{PORT}...")
    
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((SERVER_IP, PORT))
            
            with INPUT_FILE.open("r", newline="", encoding="utf-8") as infile:
                reader = csv.reader(infile, delimiter=';')
                header = next(reader) # Skipper header

                for row in reader:
                    if not row: continue
                    
                    # Oppdaterer tidsstempel til "akkurat nå"
                    row[0] = get_current_timestamp()
                    
                    # Pakk sammen til streng og send
                    message = ";".join(row) + "\n"
                    s.sendall(message.encode('utf-8'))
                    
                    # Valgfritt: Print for å se progresjon
                    # print(f"Sendt: {row[0]} - {row[2]}: {row[3]}")
                    
                    time.sleep(DELAY)
                    
            print("Ferdig med å sende alle data.")
            
    except ConnectionRefusedError:
        print("Kunne ikke koble til C#. Er serveren startet?")
    except Exception as e:
        print(f"En feil oppstod: {e}")

if __name__ == "__main__":
    run_sender()