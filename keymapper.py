# Intended to be left running in background to make a heatmap of keyboard.
# Stores the results in a pickle file to be read later.

import keyboard # Recording keypresses
import pickle # Writing save file
import time # Delaying between saves

data = {} # Keyboard data stored here
waitTime = 3 # How long to wait between saves
dataFilename = 'keymapper.p' # Name of save file

afterLastSave = 0 # Number of keys pressed since last save

def logKey(keyObject):
    global data, afterLastSave
    key = keyObject.name
    #print(key,'has been logged')
    if key in data:
        data[key] += 1
    else:
        data[key] = 1
    afterLastSave += 1

def loadData():
    global data
    # Load existing data from pickle file.
    try:    
        with open(dataFilename, 'rb') as f:
            data = pickle.load(f)
            print('datafile "%s" successfully loaded.'%dataFilename)
    except FileNotFoundError:
            print('datafile not found, will create.')
            data = {'placeholder':1} # An empty dictionary causes keymapdisplay to not be able to find a max val.

def saveData():
    global data, afterLastSave
    with open(dataFilename, 'wb') as f:
        pickle.dump(data, f)
    print('data saved.')
    afterLastSave = 0

def main():
    global data
    loadData()
    saveData()
    keyboard.on_press(logKey) # Initialize hook
    while True:
        time.sleep(waitTime)
        if afterLastSave > 10:
            saveData()
main()
