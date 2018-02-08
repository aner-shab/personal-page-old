import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

interface Paddle{
  x: number;
  y: number;
  x_speed?: number;
  y_speed?: number;
  width: number;
  height: number;
  color: string;
}
interface Ball{
  x: number;
  y: number;
  x_speed?: number;
  y_speed?: number;
  color?: string;
}

@Component({
  selector: 'app-pong',
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.scss']
})

export class PongComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('movement') controls: ElementRef;
  context;
  paddleFill = "#FFFFFF";
  playerPaddle: Paddle;
  computerPaddle: Paddle;
  ball: Ball;

  scorePlayer: number = 0;
  scoreComputer: number = 0;
  scored: boolean = false;

  width: number = 400;
  height: number = 500;
  running: boolean = false;

  constructor() {

    }

    ngOnInit(){
      this.context = this.canvas.nativeElement.getContext('2d');
      this.canvas.nativeElement.width = this.width;
      this.canvas.nativeElement.height = this.height;
      this.start();
    }

  public start() {
    this.running=true;
    this.controls.nativeElement.focus();
    this.playerPaddle = {
      x: 175,
      y: 480,
      width: 50,
      height: 10,
      color: this.paddleFill
    };
    this.computerPaddle = {
      x: 175,
      y: 10,
      width: 50,
      height: 10,
      color: this.paddleFill
    };
    this.ball = {
      x: 200,
      y: 300,
      x_speed: 0,
      y_speed: 3,
      color: this.paddleFill
    };
    this.renderAll();
  }

  public stop(){
      this.running = false;
  }

  renderAll() {
    if (this.running) {
      this.context.fillStyle = "#000";
      this.context.fillRect(0, 0, 400, 500);

      this.moveBall();
      this.moveComputer();
      this.movePaddle(0, 0, this.playerPaddle);

      let randomNumber = Math.floor(Math.random() * 5) - 2;
      this.playerPaddle.x_speed = randomNumber;
      this.renderBall(this.ball);
      this.renderPaddle(this.computerPaddle);
      this.renderPaddle(this.playerPaddle);

      setTimeout(() => {
        this.renderAll();
      }, 1000 / 60);
    }
  }

  renderPaddle(paddle: Paddle) {
    this.context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  }

  renderBall(ball: Ball) {
    this.context.beginPath();
    this.context.arc(ball.x, ball.y, 5, 2 * Math.PI, false);
    this.context.fillStyle = ball.color;
    this.context.fill();
  }

  keyDown(e){
    switch (e.keyCode){
      case 37: //Left
        this.movePaddle(-6,0,this.playerPaddle);
        break;
      case 39: // Right
        this.movePaddle(6,0,this.playerPaddle);
            break;
      default:

        break;
    }
  }
  test(){
  }
  keyUp(e){

  }
  movePaddle(x: number, y: number, paddle: Paddle){
    paddle.x += x;
    paddle.y += y;
    if (paddle === this.playerPaddle){ // patching a little speed boost for the player...
      paddle.x +=x;
      paddle.y +=y;
    }
    paddle.x_speed = x;
    paddle.y_speed = y;
    if (paddle.x < 0) {
      paddle.x = 0;
      paddle.x_speed = 0;
    } else if (paddle.x + paddle.width > 400) {
      paddle.x = 400 - paddle.width;
      paddle.x_speed = 0;
    }
  }

  moveComputer(){
      let x_pos = this.ball.x;
      let diff = -((this.computerPaddle.x + (this.computerPaddle.width / 2)) - x_pos);
      if (diff < 0 && diff < -3) {
        diff = -4;
      } else if (diff > 0 && diff > 3) {
        diff = 4;
      }
      this.movePaddle(diff, 0,this.computerPaddle);
      if (this.computerPaddle.x < 0) {
        this.computerPaddle.x = 0;
      } else if (this.computerPaddle.x + this.computerPaddle.width > 400) {
        this.computerPaddle.x = 400 - this.computerPaddle.width;
      }
  }

  moveBall(){
      this.ball.x += this.ball.x_speed;
      this.ball.y += this.ball.y_speed;
      let top_x = this.ball.x - 5;
      let top_y = this.ball.y - 5;
      let bottom_x = this.ball.x + 5;
      let bottom_y = this.ball.y + 5;

      if (this.ball.x - 5 < 0) {
        this.ball.x = 5;
        this.ball.x_speed = -this.ball.x_speed;
      } else if (this.ball.x + 5 > 400) {
        this.ball.x = 395;
        this.ball.x_speed = -this.ball.x_speed;
      }

      if (this.ball.y < 0 || this.ball.y > 500) {

        this.playerPaddle.x = 175;
        this.computerPaddle.x = 175;

        if (!this.scored) {
          if (this.ball.y < 0) {
            this.scorePlayer++;
            this.scored = true;
          }
          else {
            this.scoreComputer++;
            this.scored = true;
          }
        }

        setTimeout(()=>{
        this.ball.x_speed = 0;
        this.ball.y_speed = 3;
        this.ball.x = 200;
        this.ball.y = 250;
        this.scored = false;
        },200);
      }

      if (top_y > 250) {
        if (top_y < (this.playerPaddle.y + this.playerPaddle.height) &&
          bottom_y > this.playerPaddle.y &&
          top_x < (this.playerPaddle.x + this.playerPaddle.width) &&
          bottom_x > this.playerPaddle.x) {
          this.ball.y_speed = -3;
          this.ball.x_speed += (this.playerPaddle.x_speed / 2);
          this.ball.y += this.ball.y_speed;
        }
      } else {
        if (top_y < (this.computerPaddle.y + this.computerPaddle.height) &&
          bottom_y > this.computerPaddle.y &&
          top_x < (this.computerPaddle.x + this.computerPaddle.width) &&
          bottom_x > this.computerPaddle.x) {
          this.ball.y_speed = 3;
          this.ball.x_speed += (this.computerPaddle.x_speed / 2);
          this.ball.y += this.ball.y_speed;
        }
      }
  }



}
