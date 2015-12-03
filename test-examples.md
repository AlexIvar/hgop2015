#Test examples  

##Failure (illegal move) scenarios

#####1.Scenario  
*Player 1 places X in for instance place 1.1

[x][-][-]  
[-][-][-]  
[-][-][-]

*Player 2 tries to place O in same place as player one (place 1.1).

*Player 2 gets message: Place 1.1 is already taken. Choose another place.

#####2.scenario

Player 2 tries to make a move when it is player 1 turn.


##Winning scenarios
#####(at least 3 winning sceneaerios)

#####1.Scenario - Horizontal win

Player 1 or 2 wins by getting a 3 X's or O's in a horizontal row.

example of game:  
[x][x][x]  
[-][o][-]  
[o][-][-]

#####2.Scenario - vertical win

Player 1 or 2 wins by getting a 3 X's or O's in a vertical row.

example of game:  
[x][o][-]  
[x][o][-]  
[x][-][-]

#####3.Scenario - Dioganal win

Player 1 or 2 wins by getting a 3 X's or O's in a dioganal row.

example of game:  
[x][o][-]  
[-][x][-]  
[o][-][x]

##Draw scenarios

#####1.Scenario

player can't make a move because all places have been filled and neither player has gotten 3 in a row.

exapmle of game:

player 1 turn:  
[x][-][-]  
[-][-][-]  
[-][-][-]

player 2 turn:  
[x][-][-]  
[-][o][-]  
[-][-][-]

player 1 turn:  
[x][-][-]  
[x][o][-]  
[-][-][-]

player 2 turn:  
[x][-][-]  
[x][o][-]  
[o][-][-]

player 1 turn:  
[x][-][x]  
[x][o][-]  
[o][-][-]

player 2 turn:  
[x][o][x]  
[x][o][-]  
[o][-][-]

player 1 turn:   
[x][o][x]  
[x][o][-]  
[o][x][-]

player 2 turn:  
[x][o][x]  
[x][o][o]  
[o][x][-]

player 1 turn:   
[x][o][x]  
[x][o][o]  
[o][x][x]

all places have been filled, it's a tie!

