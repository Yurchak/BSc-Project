"""Generates and exports an array of marine container units in CSV

Choose number of containers and number of externally owned accounts.
Simulation uses 10 international ports, 5 shipping/leasing companies, and 3 basic container types.
Container ID is realistic and conforms to ISO 6346, including check digit calculation algorithm.
"""


import random, csv
from numpy.random import choice


def rand_x_digit_num(x):  # Return an X digit number with leading zeroes
    return '{0:0{x}d}'.format(random.randint(0, 10**x-1), x=x)

location = []
location.append("Shanghai")
location.append("Singapore")
location.append("Dubai")
location.append("Rotterdam")
location.append("Los Angeles")
location.append("Hamburg")
location.append("New York")
location.append("Valencia")
location.append("Tokyo")
location.append("Mumbai")

wl = [40, 34, 16, 14, 9, 9, 6, 5, 5, 5]  # weights by relative container traffic (2016-17)
wlsum = sum(wl)
for i in range(len(wl)):
    wl[i] /= wlsum  # normalize weights to sum to 1

shippingCo = []
shippingCo.append("TRH")  # Triton
shippingCo.append("MCI")  # Maersk
shippingCo.append("CEO")  # Textainer
shippingCo.append("MSC")  # Mediterranean
shippingCo.append("STM")  # CMA-CGM

wc = [10, 8, 6, 6, 5]  # weights by relative capacity (2014)
wcsum = sum(wc)
for i in range(len(wc)):
    wc[i] /= wcsum


char2num = {  # for calculating check digit after generating container ID
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
    '9': 9, 'A': 10, 'B': 12, 'C': 13, 'D': 14, 'E': 15, 'F': 16, 'G': 17,
    'H': 18, 'I': 19, 'J': 20, 'K': 21, 'L': 23, 'M': 24, 'N': 25, 'O': 26,
    'P': 27, 'Q': 28, 'R': 29, 'S': 30, 'T': 31, 'U': 32, 'V': 34, 'W': 35,
    'X': 36, 'Y': 37, 'Z': 38}

cat = ["U", "J", "Z"]
catDist = [0.8, 0.1, 0.1]

type = ["20G0", "20P1", "22R1"]
typeDef = {}
for i in range(len(type)):
    typeDef[type[i]] = ("Dry storage", "Flat rack", "Refrigerated")[i]
typeDist = [0.75, 0.2, 0.05]


class Unit:
    pass  # initialize all attributes on an individual basis

n = int(input("How many containers? "))
a = int(input("How many accounts? "))

# Generate accounts

acc = []
unitsOwned = []
unitsUsed = []
for i in range(a):
    address = '0x'
    for j in range(40):
        address += random.choice('0123456789ABCDEFabcdef')
    acc.append(address)
    unitsOwned.append(0)
    unitsUsed.append(0)

# Generate units

print("Generating list of container units at units.CSV in current dir:")
with open("units.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(("Container ID", "typeCode", "Type", "Location", "Owner", "User"))
    for i in range(n):
        self = Unit()
        id0 = choice(shippingCo, p=wc)
        id1 = choice(cat, p=catDist)
        id2 = rand_x_digit_num(6)
        self.id = id0 + id1 + id2
        # 'check digit' algorithm
        total = sum(char2num[c] * 2**x for x, c in enumerate(self.id))
        total2 = int(total/11) * 11
        checkDigit = (total - total2) % 10
        self.id += str(checkDigit)  # append check digit, completing the container ID

        self.type = choice(type, p=typeDist)
        self.location = choice(location, p=wl)
        self.owner = choice(acc)
        unitsOwned[acc.index(self.owner)] += 1
        self.user = choice(acc)
        unitsUsed[acc.index(self.user)] += 1

        writer.writerow((self.id, self.type, typeDef[self.type], self.location, self.owner, self.user))


for i in range(len(acc)):
    print("Account", acc[i],
          "currently owns", unitsOwned[i],
          "units and uses", unitsUsed[i], "units")
