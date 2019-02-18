import React, { Component } from "react"; 
import Deck from '../utilityClasses/Deck';
import GameButtons from './GameButtons';
import PokerHand from './PokerHand';



// POKERTABLE IS THE ONLY THING THAT KNOWS STATE
// React can not pass sideways, always hoist DOWN... 
class PokerTable extends Component{
    constructor(){
        super();
        this.cards = new Deck();
        this.cards.createDeck();
        this.cards.shuffleDeck();
        console.log(this.cards);
        this.state = {
            playersHand: ['deck', 'deck'],
            dealersHand: ['deck', 'deck'],
            communityCards: ['deck', 'deck', 'deck', 'deck', 'deck'],
            wager: 0,
            bankroll: 1000,
        }
        
        this.prepDeck = this.prepDeck.bind(this); //we have to preserve "this" at the beginning so it 
        //knows what to look for. It needs to look for this.prepDeck
        this.playerBet= this.playerBet.bind(this)
       
    }

    // This is a custom method. Not coming from "React"
    // we can't put this in our Deck class, because it's 
    // specific to our Hold Em
    prepDeck(){
        this.cards.createDeck();
        this.cards.shuffleDeck();
        this.cards.deck.shift(); //burn card
        const card1 = this.cards.deck.shift();
        const card2 = this.cards.deck.shift();
        const card3 = this.cards.deck.shift();
        const card4 = this.cards.deck.shift();
        // deck is now only 47, because we mutated this.deck
        // when we ran shift
        this.setState({
            playersHand: [card1,card3],
            dealersHand: [card2,card4],
    
        })
    }

    // this method will be sent to Gamebuttons. It is used to update the player's bet.
    // After they bet, we will call draw.
    playerBet(amount){
        const newWager = this.state.wager + amount;
        const newBankRoll = this.state.bankroll - amount;
        this.setState({
            wager: newWager + amount,
            bankroll: newBankRoll
        })
        this.draw();
    }

    draw(){
        // let communityNewHand = [...this.state.communityCards] SPREAD and REST operators.
        let communityNewHand = Object.assign([],this.state.communityCards);
        // const communityNewHand = this.state.communityCards;   THIS IS BAD BAD BAD
        if(communityNewHand[0] === 'deck'){
            communityNewHand = [this.cards.deck.shift(), this.cards.deck.shift(), this.cards.deck.shift()]
        }else{
            //this isn't the first draw so only draw one
            communityNewHand.push(this.cards.deck.shift());
            // or you could use the new ES6 standards
            // communityNewHand = [...communityNewHand, this.cards.deck.shift()]

        }
        this.setState({
            communityCards: communityNewHand
        })
    }
    render(){

        // this.prepDeck is not being invoked
        return(
            <div className="col-sm-12 the-table">
                <div className = "col-sm-12 text-center">
                    <p>Current Wager ${this.state.wager}</p>
                    <p>Current Bankroll ${this.state.bankroll}</p>
                    </div>
                    <PokerHand cards={this.state.dealersHand} />
                    <PokerHand cards={this.state.communityCards} /> 
                    <PokerHand cards={this.state.playersHand} />
                    <GameButtons dealFunction={this.prepDeck} betFunction={this.playerBet} /> 
                
            </div>
        )
    }
}

export default PokerTable;




