import string
import logging


def encrypt(inputText: string, N: int, D: int):
    if " " in inputText or "!" in inputText:
        logging.error("invalid input: inputText: " " // recevied " + inputText)
    if N < 1:
        logging.error("invalid input: N value less than 1 // received: " + N)
    if D != 1 and D != -1:
        logging.error("invalid input: D value must be 1 or -1 // received: " + str(D))
    if inputText == None or N == None or D == None:
        logging.error("Not all arguments provided")


    reversedInput = reversed(inputText)

    encryptedText = ""

    for char in reversedInput:
        encryptedText = encryptedText + offset(char, N, D)
    
    return encryptedText

def decrypt(inputText: string, N: int, D: int):
    if " " in inputText or "!" in inputText:
        logging.error("invalid input: inputText: " " // recevied " + inputText)
    if N < 1:
        logging.error("invalid input: N value less than 1 // received: " + N)
    if D != 1 and D != -1:
        logging.error("invalid input: D value must be 1 or -1 // received: " + str(D))
    if inputText == None or N == None or D == None:
        logging.error("Not all arguments provided")

    unreverseInput = reversed(inputText)

    decryptedText = ""

    for char in unreverseInput:
        decryptedText = decryptedText + offset(char, N, D * -1)

    return decryptedText


def offset(char: string, N: int, D: int):
    offsetValue = ord(char) + N * D
    if offsetValue > 126 or offsetValue < 34:
        return chr(offsetValue % 126 + 34)
    return chr(offsetValue)