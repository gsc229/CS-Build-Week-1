import numpy as np
from random import randint, choice, sample, seed
from room_descriptions import rooms, creatures

class Room:
    def __init__(self, id, name, description, creature, message, x, y):
        self.id = id
        self.name = name
        self.description = description
        self.creature = creature
        self.message = message
        self.north_to = None
        self.south_to = None
        self.east_to = None
        self.west_to = None
        self.x = x
        self.y = y
        
    def link_rooms(self,connecting,direction):
        reverse_dirs = {"north": "south", "south": "north", "east": "west", "west": "east"}
        reverse_dir = reverse_dirs[direction]
        setattr(self, f"{direction}_to", connecting)
        setattr(connecting, f"{reverse_dir}_to", self)

    def look_around(self,direction):
        '''
        Enter a direction and return the room in that direction
        '''
        return getattr(self,f"{direction}_to")

    def __str__(self):
        return f"{self.id}"




class World:
    def __init__(self,size_x, size_y, num_rooms):
        self.num_rooms = num_rooms
        self.width = size_x
        self.height = size_y
        self.map = np.full((self.width,self.height),".")
        self.created_rooms = []
        self.cardinal = ["east","south","north","west"]
        self.used_space = []

    def generate_rooms(self):
        s = 70
        seed(s)
        # Declare roomID variable
        roomID = 1
        
        # declare previous variable
        previous_room = None

        # variable that determines when to add the room to the world
        add_to_map = False

        # start generation
        while roomID <= self.num_rooms:
            desc = f"This is room{roomID}"
            
            if roomID == 1:
                # declare variables for the locations of the rooms on the map
                x = randint(0,self.width-1)
                y = randint(0,self.height-1)
                room = Room(roomID,'ocean',desc,x,y)
                add_to_map = True
                print(f"Will place first room at {(x,y)}\n")
                
            else:

                # check to see if the space at (x,y) is empty
                if (y,x) not in self.used_space:
                    # create new room object at x,y on the map
                    room = Room(roomID,'ocean',desc,x,y)
                    self.created_rooms.append(room)
                    add_to_map = True

                # check if the space isn't empty
                elif (y,x) in self.used_space:
                    print(f"space at {(x,y)} is not empty")
                    print(self.map[y,x])

                    # get the room at that space
                    #previous_room = self.map[y,x]

                    # find the next open space
                    s = 22
                    found = False
                    while not found:
                        direction = sample(self.cardinal,1)[0]

                        # check if the direction has not been used yet
                        if previous_room.look_around(direction) is None:
                            # if not move the (x,y) position to the empty space
                            x,y = self.move(x,y,direction)
                            # make sure its not out of bounds
                            if self.out_of_bounds(x,y):
                                found = False
                            else:
                                found = True
                        # if there already is a room in the space check a different direction
                        elif previous_room.look_around(direction) is not None:
                            s += 1
                            found = False


            if add_to_map:
                # draw the room on the world
                self.map[y,x] = room
                self.used_space.append((y,x))
                
                # spawn a new room at a new x,y position
                x,y,direction = self.spawn_room(room,x,y)

                # check to make sure the new (x,y) is not out of bounds
                if self.out_of_bounds(x,y):
                    print(f"The new room would've been out of bounds. \nUsing an existing room to spawn a new room")
                    previous_room,x,y,direction = self.new_seed()

                # connect the new room with the previous room
                if previous_room is not None:
                    print(f"linking room{previous_room.id} to room{room.id}\n")
                    previous_room.link_rooms(room,direction)

                # increase the roomID (increasing means create the next room)
                roomID += 1

                # update the previous room to the room that was just created
                previous_room = room

    def generate(self):
        x = -1
        y = 0
        roomID = 0
        previous_room = None
        width = 0
        start = 0
        end = 4
        while roomID < self.num_rooms:
            
            # move east
            if width < self.width - 1:
                direction = 'east'
                x,y = self.move(x,y,direction)
                width += 1
            elif width == self.width - 1:
                direction = 'south'
                x = 0
                x,y = self.move(x,y,direction)
                width = 0

            # pick a random room
            if roomID <= 20:
                space = choice(rooms[start:end])
                name = space["name"]
                desc = space["decription"]

            elif roomID <= 40 and roomID > 20:
                start = 5
                end = 9
                space = choice(rooms[start:end])
                name = space["name"]
                desc = space["decription"]

            elif roomID <= 60 and roomID > 40:
                start = 10
                end = 14
                space = choice(rooms[start:end])
                name = space["name"]
                desc = space["decription"]

            elif roomID <= 80 and roomID > 60:
                start = 15
                end = 19
                space = choice(rooms[start:end])
                name = space["name"]
                desc = space["decription"]

            elif roomID <= 100 and roomID > 80:
                start = 20
                end = 24
                space = choice(rooms[start:end])
                name = space["name"]
                desc = space["decription"]

            guess = randint(0,20)
            if guess%2 == 0:
                animals = sample(creatures,1)[0]
                creature = animals["creature"]
                message = animals["message"]
            else:
                creature = None
                message = None


            

            room = Room(roomID,name,desc,creature,message,x,y)

            self.map[y,x] = room
            self.created_rooms.append(room)

            if previous_room is not None:
                previous_room.link_rooms(room,direction)

            

            previous_room = room
            roomID += 1
                    
    def empty(self,x,y):
        '''
        This function checks if the space at [x,y] is empty or not.
        This is determined by checking if the Value in that space is a room object.
        '''
        position = self.map[x,y]
        
        if position == type(np.str_):
            return True
        else:
            return False

    def spawn_room(self,room,x,y):
        flag = True  
        s = 10  
        attempts = 0    
        while flag:
            #seed(s)
            card = sample(self.cardinal,1)[0]
            print(f"new direction {card}")
            if getattr(room,f"{card}_to") is None:
                new_direction = card
                flag = False
            else:
                flag = True
                s += 1
                attempts += 1

            x,y = self.move(x,y,new_direction)
            if self.out_of_bounds(x,y):
                flag = True
                s += 1
                attempts += 1
            else:
                print(f"Creating new room{room.id} at {(x,y)}")
                return x,y,new_direction
            
            if attempts == 10:
                r,x,y,new_direction = self.new_seed()
                return x,y,new_direction
            
    def move(self,x,y,new_direction):
        '''
        takes in to account the new direction for the room to spawn in and increases x and y
        to match the direction
        '''
        if new_direction == "north":
            y -= 1
        elif new_direction == "south":
            y += 1
        elif new_direction == "east":
            x += 1
        elif new_direction == "west":
            x -= 1

        return x,y            
       
    def out_of_bounds(self,x,y):
        '''
        determines whether an [x,y] coordinate position is over the world boundaries
        or not. 
        '''
        if (x < 0) or (x > self.width):
            return True
        elif (y < 0) or (y > self.height):
            return True
        else:
            return False

    def new_seed(self):
        '''
        chooses a room from the created rooms list as the launchpoint for a new starting location
        '''
        flag = True
        s = 13
        while flag:
            seed(s)
            room = sample(self.created_rooms,1)[0]
            card = sample(self.cardinal,1)[0]
            print(f"Room ID #{room.id}")
            print(f"Checking space in {card} direction")
            if getattr(room,f"{card}_to") is None:
                x,y = room.x,room.y
                x,y = self.move(x,y,card)

                if self.out_of_bounds(x,y):
                    flag = True
                    s += 1
                else:
                    return room,x,y,card

    def draw(self):
        '''
        draws the World on the screen
        '''
        
        for line in self.map:
            print(*line)
        



'''world = World(15,15,100)
world.generate()
world.draw()
nodes = []
if True:
    for room in world.created_rooms:
        north = room.north_to.id if room.north_to is not None else None
        south = room.south_to.id if room.south_to is not None else None
        east = room.east_to.id if room.east_to is not None else None
        west = room.west_to.id if room.west_to is not None else None
        room_dict = {
            "ID":room.id,
            "x":room.x,
            "y":room.y,
            "name":room.name,
            "description":room.description,
            "creature":room.creature,
            "message":room.message,
            "north_to": north,
            "south_to":south,
            "east_to":east,
            "west_to":west,
        }
        nodes.append(room_dict)

    import os
    #print(nodes)
    with open("Nodes.txt",'w') as file:
        for item in nodes:
            file.write(str(item)+"\n")
    print(f"File saved to {os.getcwd()}\\Nodes.txt")
    '''

