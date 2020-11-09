import React from "react";
import axios from "axios";
import Spinner from "./spinner";

import { SearchContainer, Results, Result, Input, Button, Mana } from "./recherche-bar-rapid.style";

const List = ({ name, imageUrl, manaCost }) => (
  <Result>
    <div className="result-image">
      <img alt="card" src={imageUrl} />
    </div>
    <div className="result-name">
      <p className="card-name">{name}</p>

      <Mana>
        {manaCost
          .replace(/\//g, "")
          .split(/((?!^)\{.*?\})/)
          .filter(Boolean)
          .map((num) => (
            <img src={`/image/mana-icons/${num}.png`} alt="icon" />
          ))}
      </Mana>
    </div>
  </Result>
);

class RechercheBar extends React.Component {
  constructor() {
    super();
    this.state = {
      cards: [],
      text: "",
      loading: false,
    };
  }

  search = async (text) => {
    this.setState({ loading: true });
    const res = await axios.get(`https://api.magicthegathering.io/v1/cards?name=${text}`);
    this.setState({ cards: res.data.cards, loading: false });
    console.log(this.state.cards);
  };

  //  clear cards
  clearCards = () =>
    this.setState({
      cards: [],
      loading: false,
    });

  onChange = (e) => this.setState({ text: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    this.search(this.state.text);
    this.setState({ text: "" });
  };

  render() {
    const { cards, text, loading } = this.state;
    return (
      <SearchContainer>
        <div className="input-container">
          {cards.length > 0 && (
            <Button type="button" onClick={this.clearCards}>
              Clear
            </Button>
          )}
          <form onSubmit={this.onSubmit}>
            <Input type="text" name="text" placeholder=" Rapid Card Search..." value={text} onChange={this.onChange} />
          </form>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <Results>
            {cards
              .filter((card, i) => {
                return i < 5;
              })
              .map((card) => {
                if (card.foreignNames.length === 0 || !card.imageUrl || !card.manaCost) {
                  return null;
                }
                return <List key={card.id} {...card} />;
              })}
          </Results>
        )}
      </SearchContainer>
    );
  }
}

export default RechercheBar;
