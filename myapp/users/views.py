from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .serializers import *
from .models import User
from argon2 import PasswordHasher
import json


@api_view(['POST'])
def create_user(request):
    """ POST = Create user. """
    data = {}

    serializer = UserPostSerializer(data =request.data)
    if serializer.is_valid():
        print("valid!")
        email = serializer.data['email']
        password = serializer.data['password']

        user = User.objects.filter(email=email)

        if not user:
            # Apply Argon2
            ph = PasswordHasher()
            hash = ph.hash(password)

            # Create user
            new_user = User(email=email, password=hash)
            new_user.save()

            request.session['email'] = email
            request.session['id'] = new_user.pk
            print(request.session['email'], "has logged in!")
            print(request.session['id'],  "user's id")
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # User with this email found... Please login...
        else:
            return Response(status=status.HTTP_409_CONFLICT)

    else:
        print(serializer.errors) 
        return Response(status=status.HTTP_500_CONFLICT)

@api_view(['POST'])
def login_user(request):
    """ Check that login credentials are correct and login. """
    # TODO: Security check on sending passwords over unencrypted HTTP
    
    serializer = UserPostSerializer(data =request.data)
    
    email = serializer.initial_data['email']
    password = serializer.initial_data['password']

    # User DNE
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    print("pass DNE test...")


    # Get user's password in database
    db_password = user.password

    ph = PasswordHasher()
    # Matches, so log in user
    if ph.verify(db_password, password):
        # Session token here
        request.session['email'] = email
        request.session['id'] = user.pk
        print(request.session['email'], "has logged in!")
        print(request.session['id'],  "user's id")

        return Response(serializer.initial_data, status=status.HTTP_200_OK)
    else:
        print("serializer error")
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def logout_user(request):
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


@api_view(['DELETE'])
def delete_user(request):
    """
    DELETE = Delete user using email.
    """
    # TODO? A user must be logged in for delete functionality to work
    # Otherwise, will fail when we try to access request.session (no user exists)

    # Get email (user) trying to be deleted
    serializer = UserPostSerializer(data =request.data)
    email = serializer.initial_data['email']
    User.objects.filter(email = email).delete()
    return Response(serializer.initial_data, status=status.HTTP_200_OK)
