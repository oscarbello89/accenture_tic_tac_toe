/**
 * @fileoverview Board Game component
 * @version  1
 * @author Oscar Bello <hola@oscarbello.es>
 * @copyright oscarbello
 *
 * History
 * v1 - Board Game Component
*/

import React, { Component } from 'react';
import '../App.css'

class BoardGame extends Component {
    
    constructor() {
    
        super()
        
        this.state = {
            matchId:'',
            boardState: [],
            nextMove: {char: "", position: ""},
            history: [],
            err: "",
            pUser: [{ charUser: "", winner: "" }],
            initialId: ''
        }

        this.matchState = {
            matchLocked: false,
            matchEnd: false,
            totalMoves: 0,
            json: {}
        }
        
    }

    callApi() {
        
        fetch('http://localhost:5000/api/tic-tac-toe/play', {
            method: 'POST',
            body: JSON.stringify(this.matchState.json)
            })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    matchId: data[0].matchId ? data[0].matchId : '',
                    boardState: data[0].boardState ? data[0].boardState : [],
                    nextMove: data[0].nextMove ? data[0].nextMove : {char: "", position: ""},
                    history: data[0].history ? data[0].history : [],
                    err: data[0].error !== "" ? data[0].error : "",
                    pUser: data[0].pUser ? data[0].pUser : [],
                    initialId: data[0].initialId ? data[0].initialId : ''
                })
            }
        )
    }

            

    componentDidMount() {
        
        this.callApi()

        if (this.state.pUser[0].winner !== "") {
             alert("win")
            this.matchState.matchEnd = true
            this.matchState.matchLocked = true
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.pUser[0].winner !== "") {
            this.matchState.matchEnd = true
            this.matchState.matchLocked = true
        }
        
        if (this.state.history.length===9) {
            this.matchState.matchEnd = true
            this.matchState.matchLocked = true
        }
  }

    click(box) {

        if (this.matchState.matchEnd || this.matchState.matchLocked) return

        if (this.state.boardState[box.dataset.box] === '-') {

            //Add the next move to send to the backend
            this.matchState.totalMoves++;
            const char = this.state.pUser[0].charUser
            const pos = parseInt(box.dataset.box)
            this.state.nextMove = {char: char, position: pos}
            //this.setState({ nextMove: {char: 'x', position: 12} })

            //Update json to send to the backend
            this.matchState.json = this.state
            
            //Call to API again
            this.callApi()

        } else {
            alert("Not valid move")

        }
        
    }

    render() {

        return (
            <div id="match">
                <div id="head">Tic Tac Toe - React with Fastify API</div>
                <div id="tttBoard" onClick={(e)=>this.click(e.target)} >
                    <div className="box" data-box="0" >{this.state.boardState[0]==="-" ? '' : this.state.boardState[0]}</div>
                    <div className="box" data-box="1">{this.state.boardState[1]==="-" ? '' : this.state.boardState[1]}</div>
                    <div className="box" data-box="2">{this.state.boardState[2]==="-" ? '' : this.state.boardState[2]}</div>
                    <div className="box" data-box="3">{this.state.boardState[3]==="-" ? '' : this.state.boardState[3]}</div>
                    <div className="box" data-box="4">{this.state.boardState[4]==="-" ? '' : this.state.boardState[4]}</div>
                    <div className="box" data-box="5">{this.state.boardState[5]==="-" ? '' : this.state.boardState[5]}</div>
                    <div className="box" data-box="6">{this.state.boardState[6]==="-" ? '' : this.state.boardState[6]}</div>
                    <div className="box" data-box="7">{this.state.boardState[7]==="-" ? '' : this.state.boardState[7]}</div>
                    <div className="box" data-box="8">{this.state.boardState[8]==="-" ? '' : this.state.boardState[8]}</div>
                </div>

                <div id="winner">{this.state.pUser[0].winner ? "Match has finished! " + this.state.pUser[0].winner + " has won!!!" : ""}</div>
                <div id="nowinner">{this.state.history.length >= 9 ?
                    !this.state.pUser[0].winner ? "Match has finished! Nobody wins!! " : ""
                    : ""}
                </div>
                <h1 id="messages">{!this.state.pUser[0].winner ?
                    this.state.err ? this.state.err : "Your Turn, Please click on a square!"
                    : "" }
                </h1>
            </div>
        )
    }
}

export default BoardGame;