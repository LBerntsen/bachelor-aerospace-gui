import csv
import time


def Write_in_csv_file(data):
    with open("output.csv", "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerows([data])
        print(data)

open("output.csv", "w").close()

with open('data.csv', mode='r', newline='', encoding='utf-8') as file:
    csv_reader = csv.reader(file, delimiter=';')
    for row in csv_reader:
        time.sleep(0.05)
        Write_in_csv_file(row)



