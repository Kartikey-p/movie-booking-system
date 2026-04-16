import { useEffect, useState } from "react";
import jsPDF from "jspdf";

function SeatBooking({ movie, goBack }) {
  const [seats, setSeats] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [userName, setUserName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  useEffect(() => {
    fetch("http://localhost:5000/api/booking")
      .then((res) => res.json())
      .then((data) => setSeats(data));
  }, []);

  const getSeatPrice = (seat) => {
    const row = seat[0];

    if (row === "A") return 100;
    if (row === "B") return 150;
    if (row === "C") return 200;
    if (row === "D") return 150;

    return 100;
  };

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0
  );

  const handleSeatClick = (seat) => {
    if (seats[seat]) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const proceedToPayment = () => {
    if (selectedSeats.length === 0) return;
    setShowPayment(true);
  };

  const confirmPayment = () => {
    selectedSeats.forEach((seat) => {
      fetch("http://localhost:5000/api/booking/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seatNumber: seat }),
      });
    });

    const updatedSeats = { ...seats };
    selectedSeats.forEach((seat) => {
      updatedSeats[seat] = true;
    });

    setSeats(updatedSeats);
    setPaymentDone(true);
    setShowPayment(false);
  };

  const downloadTicket = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Movie Ticket", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${userName || "Guest User"}`, 20, 40);
    doc.text(`Movie: ${movie.title}`, 20, 50);
    doc.text(`Genre: ${movie.genre}`, 20, 60);
    doc.text(`Seats: ${selectedSeats.join(", ")}`, 20, 70);
    doc.text(`Payment Method: ${paymentMethod}`, 20, 80);
    doc.text(`Total Paid: Rs. ${totalPrice}`, 20, 90);
    doc.text(`Status: Confirmed`, 20, 100);

    doc.save("movie-ticket.pdf");
  };

  return (
    <div style={{ textAlign: "center", color: "white" }}>
      <button
        onClick={goBack}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          background: "#444",
          color: "white",
          cursor: "pointer",
        }}
      >
        ⬅ Back
      </button>

      <h2>{movie.title}</h2>
      <p style={{ color: "#aaa" }}>{movie.genre}</p>

      {!showPayment && !paymentDone && (
        <>
          <div
            style={{
              width: "60%",
              margin: "20px auto",
              padding: "10px",
              background: "#ddd",
              color: "#000",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            SCREEN
          </div>

          <div style={{ marginTop: "20px" }}>
            {["A", "B", "C", "D"].map((row) => (
              <div
                key={row}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "10px",
                }}
              >
                {[...Array(10)].map((_, i) => {
                  if (i === 5) {
                    return <div key={i} style={{ width: "30px" }}></div>;
                  }

                  const seat = `${row}${i + 1}`;

                  let bg = "#2ecc71";
                  if (seats[seat]) bg = "#e74c3c";
                  else if (selectedSeats.includes(seat)) bg = "#f1c40f";

                  return (
                    <button
                      key={seat}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seats[seat]}
                      style={{
                        margin: "5px",
                        width: "50px",
                        height: "50px",
                        borderRadius: "10px",
                        border: "none",
                        background: bg,
                        color: "white",
                        fontSize: "11px",
                        cursor: seats[seat] ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      {seat}
                      <br />
                      Rs.{getSeatPrice(seat)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "15px" }}>
            <span style={{ margin: "10px", color: "#2ecc71" }}>■ Available</span>
            <span style={{ margin: "10px", color: "#f1c40f" }}>■ Selected</span>
            <span style={{ margin: "10px", color: "#e74c3c" }}>■ Booked</span>
          </div>

          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#1c1c1c",
              borderRadius: "12px",
              width: "60%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <h3>
              Selected Seats:{" "}
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </h3>
            <h2>Total Price: Rs. {totalPrice}</h2>

            <button
              onClick={proceedToPayment}
              disabled={selectedSeats.length === 0}
              style={{
                padding: "12px 20px",
                background: "#3498db",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Proceed to Payment
            </button>
          </div>
        </>
      )}

      {showPayment && (
        <div
          style={{
            marginTop: "30px",
            padding: "25px",
            background: "#1c1c1c",
            borderRadius: "12px",
            width: "400px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2>Payment Page</h2>

          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              width: "90%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "8px",
              border: "none",
            }}
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{
              width: "95%",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "8px",
              border: "none",
            }}
          >
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>

          <h3>Total to Pay: Rs. {totalPrice}</h3>

          <button
            onClick={confirmPayment}
            style={{
              padding: "12px 20px",
              background: "#27ae60",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Pay Now
          </button>
        </div>
      )}

      {paymentDone && (
        <div
          style={{
            marginTop: "30px",
            padding: "25px",
            background: "#1c1c1c",
            borderRadius: "12px",
            width: "450px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2>Booking Confirmed 🎉</h2>
          <p><strong>Name:</strong> {userName || "Guest User"}</p>
          <p><strong>Movie:</strong> {movie.title}</p>
          <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
          <p><strong>Total Paid:</strong> Rs. {totalPrice}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>

          <button
            onClick={downloadTicket}
            style={{
              padding: "12px 20px",
              background: "#8e44ad",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Download Ticket PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default SeatBooking;