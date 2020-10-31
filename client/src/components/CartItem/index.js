import React from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';

const CartItem = ({ item }) => {
  const [, dispatch] = useStoreContext();

  const removeFromCart = () => {
    // update global state
    dispatch({
      type: REMOVE_FROM_CART,
      _id: item._id
    });

    // update IndexedDB
    idbPromise('cart', 'delete', { ...item });
  };

  const handleChange = event => {
    const value = event.target.value;

    if (value === '0' || !value) {
    // update global state
      dispatch({
        type: REMOVE_FROM_CART,
        _id: item._id
      });

      // update IndexedDB
      idbPromise('cart', 'delete', { ...item });
    } else {
      // update global state
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: item._id,
        purchaseQuantity: parseInt(value)
      });

      // update IndexedDB
      idbPromise('cart', 'put', {
        ...item,
        purchaseQuantity: parseInt(value)
      });
    }
  };

  return (
    <div className="flex-row">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
      </div>
      <div>
        <div>{item.name}, ${item.price}</div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            value={item.purchaseQuantity}
            onChange={handleChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={removeFromCart}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;