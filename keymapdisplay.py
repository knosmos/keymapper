import pygame
import pickle, time, math
from pygame.locals import *
pygame.init()

col = 14
row = 5
cellSize = 60
pad = 2

surface = pygame.display.set_mode((col*cellSize+pad*2,row*cellSize+pad*2))
pygame.display.set_caption('Keymapper')

keys = [
    [['~',1],['1',1],['2',1],['3',1],['4',1],['5',1],['6',1],['7',1],['8',1],['9',1],['0',1],['_',1],['+',1],['back',1]],
    [['tab',1],['Q',1],['W',1],['E',1],['R',1],['T',1],['Y',1],['U',1],['I',1],['O',1],['P',1],['[',1],[']',1],['\\',1]],
    [['cap',1],['A',1],['S',1],['D',1],['F',1],['G',1],['H',1],['J',1],['K',1],['L',1],[';',1],['"',1],['enter',2]],
    [['lshift',2],['Z',1],['X',1],['C',1],['V',1],['B',1],['N',1],['M',1],['<',1],['>',1],['?',1],['rshift',2]],
    [['ctrl',2],['win',1],['alt',1],['space',6],['left',1],['down',1],['up',1],['right',1]]
]

def read(filename):
    data = pickle.load(open(filename,'rb'))
    keys = list(data.keys()).copy()
    for key in keys:
        if len(key) == 1:
            if key.islower():
                try:
                    data[key.upper()] += data[key]
                except KeyError:
                    data[key.upper()] = data[key]
                data[key] = 0
    replaces = {
        '`':'~','!':'1','@':'2','#':'3','$':'4','%':'5','^':'6','&':'7','*':'8','(':'9',')':'0','-':'_','=':'+','backspace':'back',
        '{':'[','}':']','|':'\\',
        'caps lock':'cap',':':';','\'':'"',
        'shift':'lshift',',':'<','.':'>','/':'?','right shift':'rshift',
        'right alt':'alt','left windows':'win'
    }
    for item in replaces.keys():
        if item in data:
            try:
                data[replaces[item]] += data[item]
            except KeyError:
                data[replaces[item]] = data[item]
            data[item] = 0
    return data

keyFont = pygame.font.SysFont('Consolas',17)
chrFont = pygame.font.SysFont('Consolas',25)

def draw(surface,keys,data):
    #surface.fill((255,255,255))
    surface.fill((10,10,30))
    maxkeypresses = max(data.values())
    textcolor = (255, 229, 110)
    lowestcolor=[12, 9, 69]
    highestcolor=[219, 39, 105]
    logVal = 600
    for row in range(len(keys)):
        widthCounter = 0
        for key in keys[row]:
            if key[0] in data:
                x = data[key[0]]/maxkeypresses # Linear scale
                intensity=x**0.4 # Polynomial scale
            else: intensity=0
            p = lowestcolor.copy()
            for c in range(3):
                p[c] += (highestcolor[c]-lowestcolor[c])*intensity
            pygame.draw.rect(surface,p,(widthCounter*cellSize+pad,row*cellSize+pad,cellSize*key[1]-pad,cellSize-pad))
            if len(key[0]) > 1:
                text = keyFont.render(key[0],1,textcolor)
            else:
                text = chrFont.render(key[0],1,textcolor)
            surface.blit(text,((widthCounter+0.1)*cellSize+pad,(row+0.2)*cellSize+pad))
            widthCounter += key[1]
    pygame.display.update()

def main():
    global surface, keys
    while True:
        data = read("keymapper.p")
        draw(surface,keys,data)
        time.sleep(1)
        for event in pygame.event.get():
            if event.type == QUIT: pygame.quit()

main()
