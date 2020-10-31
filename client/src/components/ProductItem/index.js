import React from "react";
import { Link } from "react-router-dom";
import { useStoreContext } from '../../utils/GlobalState';
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { idbPromise, pluralize } from "../../utils/helpers"

function ProductItem(item) {
  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  const [state, dispatch] = useStoreContext();

  const { cart } = state;

  const addToCart = () => {
    // check it there is a cart item with a matching id
    const itemInCart = cart.find(cartItem => cartItem._id === _id);

    // if there was a match, increase purchase quantity by 1
    if (itemInCart) {
      // update global state
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });

      // update indexedDB
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    // if not match, add item to cart with purchaseQuantity of 1
    } else {
      // update global state
      dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1}
      });

      // update indexedDB
      idbPromise('cart', 'put', {
        ...item,
        purchaseQuantity: 1
      });
    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default ProductItem;
