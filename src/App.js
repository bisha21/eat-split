import React from "react";
import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showFriend, setShowFriend] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState(null);
  function handleShowAddFriend(e) {
    e.preventDefault();
    setShowFriend((showFriend) => !showFriend);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }
  function handleSelection(friend) {
    setSelectedFriends((curr) => (curr?.id===friend.id ? null :friend));
}

function handleSplitBill(value)
{
  setFriends((friends)=>
friends.map((friend)=>
friend.id===selectedFriends.id ? 
{ ...friend, balance: friend.balance + value }
: friend
)
  )
}
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectedFriends={selectedFriends}
          onSelection={handleSelection}
        />
        {showFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={(e) => handleShowAddFriend(e)}>
          {showFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriends && <FormSplitBill selectedFriends={selectedFriends}  onSplitBill={handleSplitBill}/>}
    </div>
  );
}
function FriendList({ friends, onSelection, selectedFriends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} onSelection={onSelection} selectedFriends={selectedFriends} />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriends }) {
  const isSelected = selectedFriends?.id === friend.id;

  return (
    <li className={isSelected ? "select" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && (
        <p className="red">You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}


function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const newFriend = {
      name,
      image,
      balance: 0,
      id: crypto.randomUUID(),
    };
    onAddFriend(newFriend);
    setImage("");
    setName("");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <label> Image URL:</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriends,onSplitBill }) {
  const [bill,setBill]=useState("");
  const [paidByUser,setPaidByUser]=useState("");
  const paidByFriend=bill ? bill-paidByUser: "";
  const [whoPay,setWhoPay]=useState("user");
  
  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoPay=== "user" ? paidByFriend : -paidByUser);
  }

   return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
  <h2>Split a bill with {selectedFriends.name}</h2>
  <label>Bill value:</label>
  <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))} />
  <label>Your expense:</label>
  <input type="text" value={paidByUser} onChange={(e) => setPaidByUser(Number(e.target.value))} />
  <label>{selectedFriends.name} expense:</label>
  <input type="text" disabled value={paidByFriend} />
  <label>Who is paying the bill</label>
  <select value={whoPay} onChange={(e) => setWhoPay(e.target.value)}>
    <option value="user">You</option>
    <option value="friend">{selectedFriends.name}</option>
  </select>
  <Button>Split bill</Button>
</form>

  );
}
