import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from "react-router-dom";
import StockCard from "../components/StockCard";

const Stocks = () => {
    const { loggedIn, setLoggedIn, user, setUser } = useContext(AuthContext);
    const [stocks, setStocks] = useState([]);
    const [newStock, setNewStock] = useState({
        name: "",
        symbol: "",
        price: "",
        quantity: "",
    });
    const [editingStockId, setEditingStockId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loggedIn) {
            navigate("/");
        }
    }, [loggedIn, navigate]);

    const handleLogout = () => {
        setLoggedIn(false);
        setUser(null);

        localStorage.removeItem("loggedIn");
        localStorage.removeItem("user");

        navigate("/");
    };

    const handleInputChange = (e, field) => {
        setNewStock({ ...newStock, [field]: e.target.value });
    };
    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length >= 2) {
            const response = await fetch(
                `https://api.twelvedata.com/symbol_search?symbol=${query}`
            );
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.data || []);
            }
        } else {
            setSearchResults([]);
        }
    };
    const handleSymbolSelect = (symbol, name) => {
        setNewStock({ ...newStock, symbol, name });
        setSearchQuery("");
        setSearchResults([]);
    };
    const handleAddStock = async () => {
        const { name, symbol, price, quantity } = newStock;

        if (!name || !symbol || !price || !quantity) {
            alert("All fields are required.");
            return;
        }

        const response = await fetch("http://localhost:8080/api/stocks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                symbol,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                user: { id: user.id },
            }),
        });

        if (response.ok) {
            const stock = await response.json();
            setStocks([...stocks, stock]);
            setNewStock({ name: "", symbol: "", price: "", quantity: "" });
        }
    };

    const handleDeleteStock = async (stockId) => {
        const response = await fetch(
            `http://localhost:8080/api/stocks/${stockId}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            setStocks(stocks.filter((stock) => stock.id !== stockId));
        }
    };

    const handleEditStock = (stock) => {
        setEditingStockId(stock.id);
        setNewStock({
            name: stock.name,
            symbol: stock.symbol,
            price: stock.price,
            quantity: stock.quantity,
        });
    };

    const handleUpdateStock = async () => {
        const { name, symbol, price, quantity } = newStock;

        if (!name || !symbol || !price || !quantity) {
            alert("All fields are required.");
            return;
        }

        const response = await fetch(
            `http://localhost:8080/api/stocks/${editingStockId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    symbol,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    user: { id: user.id },
                }),
            }
        );

        if (response.ok) {
            const updatedStock = await response.json();
            setStocks(
                stocks.map((stock) =>
                    stock.id === editingStockId ? updatedStock : stock
                )
            );
            setEditingStockId(null);
            setNewStock({ name: "", symbol: "", price: "", quantity: "" });
        }
    };

    const handleDisplayStocks = async () => {
        const response = await fetch(
            `http://localhost:8080/api/stocks/user/${user.id}`
        );
        if (response.ok) {
            const stocks = await response.json();
            setStocks(stocks);
        }
    };

    useEffect(() => {
        handleDisplayStocks();
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-lg mb-4">
                <h1 className="text-2xl font-bold">Hello, {user.username}!</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 py-2 px-4"
                >
                    Logout
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                <h2 className="text-xl font-bold mb-4">Manage Stocks</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 p-2">
                                    Name
                                </th>
                                <th className="border border-gray-300 p-2">
                                    Symbol
                                </th>
                                <th className="border border-gray-300 p-2">
                                    Price
                                </th>
                                <th className="border border-gray-300 p-2">
                                    Quantity
                                </th>
                                <th className="border border-gray-300 p-2">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock) => (
                                <tr key={stock.id}>
                                    <td className="border border-gray-300 p-2">
                                        {stock.name}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {stock.symbol}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        ${stock.price}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {stock.quantity}
                                    </td>
                                    <td className="border border-gray-300 p-2 flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleEditStock(stock)
                                            }
                                            className="bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 py-1 px-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteStock(stock.id)
                                            }
                                            className="bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 py-1 px-2"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="text"
                                        value={newStock.name}
                                        onChange={(e) =>
                                            handleInputChange(e, "name")
                                        }
                                        placeholder="Name"
                                        className="w-full border rounded p-1"
                                        disabled
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="text"
                                        value={newStock.symbol}
                                        onChange={(e) => {
                                            handleInputChange(e, "symbol");
                                            handleSearchChange(e);
                                        }}
                                        placeholder="Symbol"
                                        className="w-full border rounded p-1"
                                    />
                                    <div className="absolute w-[18%] h-60 overflow-y-auto">
                                        {searchResults.length > 0 && (
                                            <ul className="border rounded shadow-lg bg-white mt-2">
                                                {searchResults.map(
                                                    (result, index) => (
                                                        <li
                                                            key={index}
                                                            className="p-2 hover:bg-gray-200 cursor-pointer"
                                                            onClick={() => {
                                                                handleSymbolSelect(
                                                                    result.symbol,
                                                                    result.instrument_name
                                                                );
                                                            }}
                                                        >
                                                            {
                                                                result.instrument_name
                                                            }{" "}
                                                            ({result.symbol})
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="number"
                                        value={newStock.price}
                                        onChange={(e) =>
                                            handleInputChange(e, "price")
                                        }
                                        placeholder="Price"
                                        className="w-full border rounded p-1"
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="number"
                                        value={newStock.quantity}
                                        onChange={(e) =>
                                            handleInputChange(e, "quantity")
                                        }
                                        placeholder="Quantity"
                                        className="w-full border rounded p-1"
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={
                                            editingStockId
                                                ? handleUpdateStock
                                                : handleAddStock
                                        }
                                        className={`${
                                            editingStockId
                                                ? "bg-green-500"
                                                : "bg-blue-500"
                                        } text-white rounded-lg hover:${
                                            editingStockId
                                                ? "bg-green-600"
                                                : "bg-blue-600"
                                        } transition duration-200 py-1 px-2`}
                                    >
                                        {editingStockId ? "Update" : "Add"}
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <StockCard stocks={stocks} />
        </div>
    );
};

export default Stocks;
