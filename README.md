# Song-Showdown-V1
Inspired by the Songtrivia2 game, I developed my own song guessing game. To learn Socket.io, I adapted the Songtrivia2 game into a professional wrestling theme, adding videos related to this theme to make the application more entertaining. In each round, a song plays, and the player tries to guess the wrestler or artist associated with the song from four given options. The game can be played in single-player or two-player mode. However, when played in two-player mode, the game encounters many issues, such as synchronization problems. After considering how to solve these issues, I realized that I was using Socket.io incorrectly. Therefore, I will create a second version from scratch, but I still wanted to share the first version.

[A video demonstrating how the application works and appears on screen.](https://youtu.be/VO_6zhtz4v0)

The game can be played solo or with two players. Players can create a game by selecting a profile picture and username, or they can join a friend's room using an invitation code.

- Once the game starts, players must try to guess the playing song within 10 seconds.
- After guessing, a 30-second video of the artist who owns the song is played.
- Each game consists of 5 questions, and the game ends with a scoreboard after the 5th question.

Some screenshots from the game:







![Screenshot_1](https://github.com/tynansylvester23999/Song-Showdown-V1/assets/158298979/26f2dd41-ab3c-4f44-9591-10858501ef85)
