
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from pusher import Pusher
from django.http import JsonResponse
import environ
from django.contrib.auth.models import User
from .models import Room, Player, PlayerVisited
from rest_framework.decorators import api_view
import json
from .room_generator import RoomGenerator
import colorama
from colorama import Fore, Back, Style
colorama.init()

env = environ.Env()
environ.Env.read_env()

# instantiate pusher
pusher = Pusher(app_id=env('PUSHER_APP_ID'), key=env('PUSHER_KEY'), secret=env('PUSHER_SECRET'), cluster=env('PUSHER_CLUSTER'))


@csrf_exempt
@api_view(["GET"])
def initialize(request):
    # create the rooms with the room_gen
    print(len(Room.objects.all())) 
    Room.objects.all().delete() # if they exist, delete existing rooms
    
    
    num_rooms = 101
    width = 20
    height = 20
    generated_rooms = RoomGenerator()
    generated_rooms.generate_rooms(height, width, num_rooms)
    generated_rooms.print_rooms()

    # set the user
    user = request.user
    player = user.player
    player_id = player.id
    uuid = player.uuid
    print(f"Room.objects.first().id: {Room.objects.first().id}")

    player.currentRoom = Room.objects.first().id
    player.save()
    print(f"user.username: {user.username}")
    print(f"player.currentRoom: {player.currentRoom}")

    room = Room.objects.first()
    print(f"room: {room}")

    visit_connection = PlayerVisited(player=player, room=room)
    visit_connection.save()
    print(f"visit_connection: {visit_connection}")

    visited_room = player.hasVisited(room)
    print(f"visited_room (api.py): {visited_room}")

    players = room.playerNames(player_id)
    print("REQUEST: ", request)
    return JsonResponse({'uuid': uuid, 'name': player.user.username, 'title': room.title, 'description': room.description, 'players': players, 'room_id': room.id}, safe=True)


@api_view(["GET"])
def rooms(request):
    print("RRRRRROOOOOOOOMMMMMMMMSSSSSSS!!!!!!!!!!!!!!")

    rooms = Room.objects.all()
    room_data = []
    for room in rooms:
        room_data.append(
            {"id": room.id, "title": room.title, "description": room.description, "north": room.n_to, "east": room.e_to, "south": room.s_to, "west": room.w_to, "x": room.x_c, "y": room.y_c})
    """ 
    w = World()
    num_rooms = 44
    width = 8
    height = 7
    w.generate_rooms(width, height, num_rooms)
    w.print_rooms()
    """
    # w = World()
    # num_rooms = 44
    # width = 8
    # height = 7
    # w.generate_rooms(width, height, num_rooms)
    # w.print_rooms()

    return JsonResponse({'num_rooms': len(room_data), 'rooms': room_data}, safe=True)
    #room = player.room()
    # water_rooms = Room.objects.filter(water=room.water) #
    # water_map = {#
    #     "water": room.water,
    #     "rooms": [{
    #         'id': i.id,
    #         'x': i.coord_x,
    #         'y': i.coord_y,
    #         'north': i.north,
    #         'south': i.south,
    #         'east': i.east,
    #         'west': i.west
    #     } for i in water_rooms]
    # }#
    # rooms_visited = PlayerVisited.objects.filter(player=player)#
    # visited_list = [i.room.id for i in rooms_visited]#
    # players = room.playerNames(player_id)
    # return JsonResponse({'uuid': uuid, 'name':player.user.username, 'room_id':room.id, 'title':room.title, 'description':room.description, 'players':players}, safe=True) #


# @csrf_exempt
@api_view(["POST"])
def move(request):
    print("MOVE!!!!!!!")

    dirs = {"n": "north", "s": "south", "e": "east", "w": "west"}
    reverse_dirs = {"n": "south", "s": "north", "e": "west", "w": "east"}
    player = request.user.player

    print(f"username: {request.user.username}")
    print(f"request.user.player (api move): {player}")
    print(f"type player: {type(player)} ")
    print(
        f"Player.objects.get(id=player.id): {Player.objects.get(id=player.id)}")

    #print(f"Room.objects.all(): {Room.objects.all()}")
    print(f"Room.objects.all()[0].id: {Room.objects.all()[0].id}")
    print(f"\nplayer.currentRoom: {player.currentRoom}")
    print(f"Room.objects.get(): {Room.objects.get(id=player.currentRoom)}")
    player_id = player.id
    player_uuid = player.uuid

    data = json.loads(request.body)
    direction = data['direction']
    print(f"dirction (api move): {direction}")

    room = player.room()
    print(f"player.room() (api move): {room}")

    # add items here if we want them
    nextRoomID = None
    print(Fore.YELLOW)
    if direction == "n":
        nextRoomID = room.n_to
        print(f"room.n_to: {nextRoomID}")
    elif direction == "s":
        nextRoomID = room.s_to
        print(f"room.s_to: {nextRoomID}")
    elif direction == "e":
        nextRoomID = room.e_to
        print(f"room.e_to: {nextRoomID}")
    elif direction == "w":
        nextRoomID = room.w_to
        print(f"room.w_to: {nextRoomID}")
    print(Style.RESET_ALL)

    # DO something with the 'next room'
    if nextRoomID is not None and nextRoomID > 0:
        nextRoom = Room.objects.get(id=nextRoomID)
        # player enters room
        player.currentRoom = nextRoomID
        player.save()
        description = nextRoom.description

        # Still making use of nextRoom
        if player.hasVisited(nextRoom) and nextRoom.description_b:
            description = nextRoom.description_b

        if not player.hasVisited(nextRoom):
            PlayerVisited.objects.create(player=player, room=nextRoom)
        print(
            Fore.GREEN + f"After if not player.hasVisited(nextRoom):  \nPlayerVisited.objects.create(player=player, room=room -->    \nplayer.hasVisited(nextRoom): {player.hasVisited(nextRoom)}" + Style.RESET_ALL)

        players = nextRoom.playerNames(player_id)
        currentPlayerUUIDs = room.playerUUIDs(player_id)
        nextPlayerUUIDs = nextRoom.playerUUIDs(player_id)
        rooms_visited = PlayerVisited.objects.filter(player=player)
        visited_list = [i.room.id for i in rooms_visited]

        for p_uuid in currentPlayerUUIDs:
            pusher.trigger(f'p-channel-{p_uuid}', u'broadcast', {
                           'message': f'{player.user.username} has walked {dirs[direction]}.'})

        for p_uuid in nextPlayerUUIDs:
            pusher.trigger(f'p-channel-{p_uuid}', u'broadcast', {
                           'message': f'{player.user.username} has entered from the {reverse_dirs[direction]}.'})

        return JsonResponse({'name': player.user.username, 'room_id': nextRoom.id, 'title': nextRoom.title, 'description': nextRoom.description, 'players': players, 'error_msg': ""}, safe=True)

    else:
        players = room.playerNames(player_id)
        return JsonResponse({'name': player.user.username, 'title': room.title, 'description': room.description, 'players': players, 'error_msg': "You cannot move that way."}, safe=True)

# if player.hasVisited(room) and room.description_b:#
#     description = nextRoom.description_b#


@csrf_exempt
@api_view(["POST"])
def say(request):
    # IMPLEMENT
    return JsonResponse({'error': "Not yet implemented"}, safe=True, status=500)
