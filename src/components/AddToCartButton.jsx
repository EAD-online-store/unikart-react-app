import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa6";

const AddToCartButton = ({ data }) => {
  const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [loadingRedirect, setLoadingRedirect] = useState(false); // For login/signup button loading state
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user); // Accessing user state
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setQty] = useState(0);
  const [cartItemDetails, setCartItemsDetails] = useState();
  const [showModal, setShowModal] = useState(false); // For login/signup modal

  const navigate = useNavigate(); // For navigating programmatically
  const location = useLocation(); // To get the current location (URL)

  const handleADDTocart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if the user is logged in
    if (!user || !user._id) {
      setShowModal(true); // Show modal if user is not logged in
      return;
    }

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.addTocart,
        data: {
          productId: data?._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success("Product added to cart!");
        if (fetchCartItem) {
          fetchCartItem();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Checking this item in cart or not
  useEffect(() => {
    const checkingItem = cartItem.some(
      (item) => item.productId._id === data._id
    );
    setIsAvailableCart(checkingItem);

    const product = cartItem.find((item) => item.productId._id === data._id);
    setQty(product?.quantity);
    setCartItemsDetails(product);
  }, [data, cartItem]);

  // Prevent scrolling when the modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);

  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await updateCartItem(cartItemDetails?._id, qty + 1);

    if (response.success) {
      toast.success("Item quantity increased");
    }
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (qty === 1) {
      deleteCartItem(cartItemDetails?._id);
    } else {
      const response = await updateCartItem(cartItemDetails?._id, qty - 1);

      if (response.success) {
        toast.success("Item quantity decreased");
      }
    }
  };

  const handleRedirect = (url) => {
    setLoadingRedirect(true);
    // Redirect to the login or register page, passing the current page as a query parameter
    navigate(url, { state: { from: location.pathname } });
  };

  return (
    <>
      <div className="w-full max-w-[150px]">
        {isAvailableCart ? (
          <div className="flex w-full h-full">
            <button
              onClick={decreaseQty}
              className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
              aria-label="Decrease quantity"
            >
              <FaMinus />
            </button>

            <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
              {qty}
            </p>

            <button
              onClick={increaseQty}
              className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
              aria-label="Increase quantity"
            >
              <FaPlus />
            </button>
          </div>
        ) : (
          <button
            onClick={handleADDTocart}
            className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded"
            disabled={loading} // Disable button while loading
            aria-label="Add to cart"
          >
            {loading ? <Loading /> : "Add"}
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md relative">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-gray-800"
            >
              Guest Login
            </h2>
            <p id="modal-description" className="mt-2 text-sm text-gray-600">
              Thank you for choosing to shop! Please log in or sign up to
              proceed.
            </p>
            <div className="flex justify-between gap-4 mt-4">
              <button
                className="bg-gray-800 text-white py-2 px-4 rounded w-full"
                onClick={() => handleRedirect("/login")}
              >
                {loadingRedirect ? <Loading /> : "Login"}
              </button>
              <button
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded w-full"
                onClick={() => handleRedirect("/register")}
              >
                {loadingRedirect ? <Loading /> : "Sign Up"}
              </button>
            </div>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToCartButton;
