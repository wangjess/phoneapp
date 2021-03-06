from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .serializers import *
from .models import User
from argon2 import PasswordHasher
from django.http import JsonResponse
import json

@api_view(['POST'])
def create_user(request):
    """ POST = Create user. """
    data = {}

    my_json = request.body.decode('utf8').replace("'", '"')
    data = json.loads(my_json)
    serializer = UserPostSerializer(data=request.data)

    if serializer.is_valid():
        email = data['email']
        codename = data['codename']
        password = data['password']

        user = User.objects.filter(email=email)

        if not user:
            # Apply Argon2
            ph = PasswordHasher()
            hash = ph.hash(password)

            # Create user
            new_user = User(email=email, password=hash, codename=codename)
            new_user.save()

            request.session['email'] = email
            request.session['id'] = new_user.pk
            print(request.session['email'], "has logged in!")
            print("user's id:", request.session['id'])
            return Response(serializer.data, status=status.HTTP_200_OK)

        # User with this email found... Please login...
        else:
            return Response(status=status.HTTP_409_CONFLICT)

    else:
        print(serializer.errors)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def login_user(request):
    """ POST: Check that login credentials are correct and login. """
    # TODO: Security check on sending passwords over unencrypted HTTP
    data = {}

    my_json = request.body.decode('utf8').replace("'", '"')
    data = json.loads(my_json)
    email = data["email"]
    password = data["email"]

    print("inside login_user")
    serializer = UserPostSerializer(data=request.data)
    print("got serializer")

    # Before attempting login, confirm user exists
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    print("pass DNE test...")

    # Get user's password in database
    db_password = user.password
    print("db_password:", db_password)

    ph = PasswordHasher()
    # Matches, so log in user
    if ph.verify(db_password, password):
        print("logging in")
        # Session token here
        request.session['email'] = email
        request.session['id'] = user.pk
        print(request.session['email'], "has logged in!")
        print(request.session['id'], "user's id")

        return Response(serializer.initial_data, status=status.HTTP_200_OK)
    else:
        print("serializer error")
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def logout_user(request):
    """ POST = Log out user. """
    # TODO: Check that someone is logged in otherwise get error
    # Use double quotes to make it valid JSON
    data = {}
    my_json = request.body.decode('utf8').replace("'", '"')
    data = json.loads(my_json)
    email = data["email"]

    if request.session['email'] == email:
        print(request.session['email'], "has logged out!")
        del request.session['email']
        request.session.flush()
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_403_METHOD_NOT_ALLOWED)


@api_view(['POST'])
def delete_user(request):
    """ POST = Delete user using email. """
    data = {}

    # TODO: Right now anybody can delete anyone, make sure only admin can
    my_json = request.body.decode('utf8').replace("'", '"')
    data = json.loads(my_json)
    email = data['email']

    # Get user to be deleted
    userToDelete = User.objects.filter(email=email)
    userToDelete.delete()
    return Response(status=status.HTTP_200_OK)
