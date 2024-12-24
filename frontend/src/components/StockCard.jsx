import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";

const StockCard = ({ stocks }) => {
    const { api } = useContext(AuthContext);
    const [stockDetails, setStockDetails] = useState([]);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [topPerformingStock, setTopPerformingStock] = useState(null);
    const [portfolioDistribution, setPortfolioDistribution] = useState([]);

    // Fetch stock data for each stock symbol
    useEffect(() => {
        const fetchStockData = async () => {
            const stockData = await Promise.all(
                stocks.map(async (stock) => {
                    const response = await fetch(
                        `https://api.twelvedata.com/price?symbol=${stock.symbol}&interval=1day&apikey=${api}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        const currentPrice = data.price || "N/A";
                        const profitLoss =
                            currentPrice !== "N/A"
                                ? (
                                      (currentPrice - stock.price) *
                                      stock.quantity
                                  ).toFixed(2)
                                : "N/A";
                        return {
                            ...stock,
                            currentPrice,
                            profitLoss,
                        };
                    }
                    return {
                        ...stock,
                        currentPrice: "N/A",
                        profitLoss: "N/A",
                    };
                })
            );
            setStockDetails(stockData);
            calculateMetrics(stockData);
        };

        fetchStockData();
    }, [stocks]);

    const calculateMetrics = (stockData) => {
        let totalValue = 0;
        let topStock = null;
        const distribution = [];

        stockData.forEach((stock) => {
            if (stock.currentPrice !== "N/A") {
                const stockValue = stock.currentPrice * stock.quantity;
                totalValue += stockValue;

                if (!topStock || stockValue > topStock.value) {
                    topStock = { ...stock, value: stockValue };
                }

                distribution.push({
                    name: stock.name,
                    symbol: stock.symbol,
                    percentage: ((stockValue / totalValue) * 100).toFixed(2),
                });
            }
        });

        setPortfolioValue(totalValue);
        setTopPerformingStock(topStock);
        setPortfolioDistribution(distribution);
    };

    return (
        <div className="p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4 ">
                <h2 className="text-xl font-bold mb-4">Portfolio Metrics</h2>
                <div className="mb-4 ">
                    <p>
                        <strong>Total Portfolio Value: </strong>$
                        {portfolioValue.toFixed(2)}
                    </p>
                    {topPerformingStock && (
                        <p>
                            <strong>Top Performing Stock: </strong>
                            {topPerformingStock.name} (
                            {topPerformingStock.symbol}) - $
                            {topPerformingStock.value.toFixed(2)}
                        </p>
                    )}
                </div>
                <h3 className="font-semibold mb-2">Portfolio Distribution</h3>
                <ul>
                    {portfolioDistribution.map((stock, index) => (
                        <li key={index} className="mb-2">
                            {stock.name} ({stock.symbol}): {stock.percentage}%
                            of portfolio
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-wrap gap-4 sm:justify-start justify-center">
                {stockDetails.map((stock, index) => (
                    <div
                        key={index}
                        className="bg-white border rounded-lg p-4 shadow-lg sm:w-60 w-full"
                    >
                        <h2 className="text-xl font-bold">{stock.name}</h2>
                        <p className="text-lg text-gray-600">
                            Symbol: {stock.symbol}
                        </p>
                        <p className="text-lg text-gray-800">
                            Buy Price: ${stock.price}
                        </p>
                        <p className="text-lg text-gray-800">
                            Current Price: ${stock.currentPrice}
                        </p>
                        <p className="text-lg text-gray-800">
                            Quantity: {stock.quantity}
                        </p>
                        <p className="text-lg text-gray-800">
                            Buy Total Value: $
                            {(stock.price * stock.quantity).toFixed(2)}
                        </p>
                        <p className="text-lg text-gray-800">
                            Current Total Value: $
                            {(stock.currentPrice * stock.quantity).toFixed(2)}
                        </p>
                        <p className="text-lg text-black">
                            Profit/Loss:
                            <span
                                className={`${
                                    stock.profitLoss < 0
                                        ? "text-red-500"
                                        : "text-green-500"
                                }`}
                            >
                                {" "}
                                ${stock.profitLoss} (
                                {(
                                    (stock.profitLoss /
                                        (stock.price * stock.quantity)) *
                                    100
                                ).toFixed(2)}
                                %)
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockCard;
