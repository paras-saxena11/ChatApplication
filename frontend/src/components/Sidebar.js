import React, { useContext, useEffect } from 'react'
import { Col, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import { addNotifications, resetNotifiactions } from '../features/userSlice';
import "./Sidebar.css";

function Sidebar() {
    // const rooms = ["first room", "second room", "third room"];
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const { socket, members, setMembers, currentRoom, setCurrentRoom, rooms, setRooms, privateMemberMsg, setPrivateMemberMsg } = useContext(AppContext);

    function joinRoom(room, isPublic = true) {
        if (!user) {
            return alert('Please Login');
        }
        socket.emit("join-room", room, currentRoom);
        setCurrentRoom(room);

        if (isPublic) {
            setPrivateMemberMsg(null)
        }
        dispatch(resetNotifiactions(room));

    }

    socket.off("notifications").on("notifications", (room) => {
        if (currentRoom !== room) dispatch(addNotifications(room));
    })

    useEffect(() => {
      if (user) {
        setCurrentRoom("general");
        getRooms();
        socket.emit("join-room", "general");
        socket.emit("new-user");
      }
    }, [socket]);

    socket.off("new-user").on("new-user", (payload) => {
      setMembers(payload);
      // console.log(payload);
    });

    function getRooms() {
      fetch("https://chatappbackend-i75j.onrender.com/rooms")
        // fetch("http://localhost:5001/rooms")
        .then((res) => res.json())
        .then((data) => setRooms(data));
    }

    function orderIds(id1, id2) {
      if (id1 > id2) {
        return id1 + "-" + id2;
      } else {
        return id2 + "-" + id1;
      }
    }

    function handlePrivateMemberMsg(member) {
      setPrivateMemberMsg(member);
      const roomId = orderIds(user._id, member._id);
      joinRoom(roomId, false);
    }
    if (!user) {
      return <></>;
    }
    return (
      <>
        <h2>Available Rooms</h2>
        <ListGroup>
          {rooms.map((room, idx) => (
            <ListGroup.Item
              key={idx}
              onClick={() => joinRoom(room)}
              active={room === currentRoom}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {room}{" "}
              {currentRoom !== room && (
                <span className="badge rounded-pill bg-primary">
                  {user.newMessages[room]}
                </span>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <h2>Members</h2>
        {members.map((member) => (
          <ListGroup.Item
            key={member.id}
            style={{ cursor: "pointer" }}
            active={privateMemberMsg?._id === member?._id}
            onClick={() => handlePrivateMemberMsg(member)}
            disabled={member._id === user._id}
          >
            <Row>
              <Col xs={2} className="member-status">
                <img
                  src={member.picture}
                  alt=""
                  className="member-status-img"
                />
                {member.status === "online" ? (
                  <i className="fas fa-circle sidebar-online-status"></i>
                ) : (
                  <i className="fas fa-circle sidebar-offline-status"></i>
                )}
              </Col>
              <Col xs={9}>
                {member.name}
                {member._id === user?._id && " (You)"}
                {member.status === "offline" && " (offline)"}
              </Col>
              <Col xs={1}>
                <span className="badge rounded-pill bg-primary">
                  {user.newMessages[orderIds(member._id, user._id)]}
                </span>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </>
    );
};

export default Sidebar
