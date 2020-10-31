import React, { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';

import ProductItem from "../ProductItem";
import { QUERY_PRODUCTS } from "../../utils/queries";
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { useStoreContext } from '../../utils/GlobalState';
import { idbPromise } from '../../utils/helpers';
import spinner from "../../assets/spinner.gif";

function ProductList() {
  const [state, dispatch] = useStoreContext();

  const { currentCategory } = state;

  const { loading, data: productData } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (productData) {
      // store in global state object
      dispatch({
        type: UPDATE_PRODUCTS,
        products: productData.products
      });

      // and store in IndexedDB
      productData.products.forEach(product => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      // if we're offline, get all of the data from the 'products' store
      idbPromise('products', 'get').then(indexedProducts => {
        // use retrieved data to set global state for offline browsing
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts
        });
      });
    }
  }, [productData, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
            {filterProducts().map(product => (
                <ProductItem
                  key= {product._id}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  quantity={product.quantity}
                />
            ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      { loading ? 
      <img src={spinner} alt="loading" />: null}
    </div>
  );
}

export default ProductList;
