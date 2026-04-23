import { useState, useEffect } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaBan,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Landing/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateQuantity,
} from "../../Redux/actions/cartActions";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../Redux/actions/wishlistAction";
import { API_URI } from "../../../config";
import ImageMosaicLoader from "../Loader/ImageMosaicLoader";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [linkedProducts, setLinkedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentVariantId, setCurrentVariantId] = useState(null);
  const [isOrderable, setIsOrderable] = useState(true);

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const isInWishlist = product ? wishlistItems.includes(product._id) : false;

  const cartItem = cartItems.find(
    (item) => item.productId === currentVariantId
  );
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    const fetchProductDetails = async () => {
      const res = await axios.get(`${API_URI}/plist/productlist/${productId}`);
      const main = res.data.product;
      const current =
        main.linkedProducts.find((v) => v._id === productId) ||
        main.linkedProducts[0];

      setCurrentVariantId(current._id);
      setIsOrderable(main.isOrderable !== false);
      setProduct({
        _id: current._id,
        name: current.name,
        price: current.price,
        images: current.images,
        color: current.color,
        colorCode: current.colorCode,
        description: current.description,
        category: main.category,
        material: main.material,
      });

      setSelectedImage(current.images[0]);
      setLinkedProducts(main.linkedProducts);
      setLoading(false);
    };

    fetchProductDetails();
  }, [productId]);

  const handleColorChange = (variant) => {
    setCurrentVariantId(variant._id);
    setProduct(variant);
    setSelectedImage(variant.images[0]);
    navigate(`/product/${variant._id}`, { replace: true });
  };

  const addToCartHandler = () => {
    if (!isOrderable) return;
    setIsAddingToCart(true);
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
        color: product.color,
        size: product.size || null,
      })
    ).finally(() => setIsAddingToCart(false));
  };

  if (loading) return <ImageMosaicLoader />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] pt-16 sm:pt-24 px-3 sm:px-6 pb-36">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ✅ IMAGE SECTION */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-4 shadow-2xl">
              <div className="relative overflow-hidden rounded-2xl mb-4">
                <img
                  src={selectedImage}
                  className="w-full h-[260px] sm:h-[360px] lg:h-[420px] object-cover transition duration-700 hover:scale-105"
                />

                {/* Unavailable overlay */}
                {!isOrderable && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg flex items-center gap-2 shadow-xl">
                      <FaBan /> Not Available for Order
                    </div>
                  </div>
                )}

                {/* ✅ Floating Wishlist */}
                <button
                  onClick={() =>
                    isInWishlist
                      ? dispatch(removeFromWishlist(product._id))
                      : dispatch(addToWishlist(product._id))
                  }
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition 
                ${
                  isInWishlist
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-600"
                }`}
                >
                  <FaHeart />
                </button>
              </div>

              {/* ✅ Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    className={`h-16 sm:h-20 object-cover rounded-xl cursor-pointer border-2 transition 
                  ${
                    selectedImage === img
                      ? "border-orange-500"
                      : "border-gray-200"
                  }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ✅ PRODUCT INFO */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
            {/* ✅ Title + Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {product.name}
              </h1>
              <p className="text-orange-500 text-2xl font-bold mt-1">
                ₹{product.price.toFixed(2)}
              </p>
              {!isOrderable && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                  <FaBan className="text-xs" />
                  Currently unavailable for ordering
                </div>
              )}
            </div>

            {/* ✅ Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* ✅ Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border border-gray-200 rounded-2xl p-4">
              <div>
                <p className="font-medium text-gray-500">Category</p>
                <p>{product.category}</p>
              </div>
              {product.material && (
                <div>
                  <p className="font-medium text-gray-500">Material</p>
                  <p>{product.material}</p>
                </div>
              )}
            </div>

            {/* ✅ Color Selector */}
            <div>
              <h3 className="font-semibold mb-2">Available Colors</h3>
              <div className="flex gap-4 flex-wrap">
                {linkedProducts.map((variant) => (
                  <div
                    key={variant._id}
                    onClick={() => handleColorChange(variant)}
                    className={`w-9 h-9 rounded-full cursor-pointer border-4 transition
                  ${
                    product._id === variant._id
                      ? "border-orange-500"
                      : "border-gray-200"
                  }`}
                    style={{ backgroundColor: variant.colorCode }}
                  />
                ))}
              </div>
            </div>

            {/* ✅ DESKTOP CART CONTROLS */}
            <div className="hidden sm:flex items-center gap-4 pt-4">
              {!isOrderable ? (
                <div className="px-10 py-4 rounded-full bg-gray-300 text-gray-500 font-bold flex items-center gap-3 cursor-not-allowed">
                  <FaBan />
                  Not Available
                </div>
              ) : quantityInCart > 0 ? (
                <>
                  {/* ✅ Quantity Controller */}
                  <div className="flex items-center bg-orange-50 rounded-full overflow-hidden shadow-inner">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity(cartItem._id, quantityInCart - 1)
                        )
                      }
                      className="px-6 py-3 bg-orange-500 text-white"
                    >
                      <FaMinus />
                    </button>

                    <span className="px-6 font-bold text-gray-900">
                      {quantityInCart}
                    </span>

                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity(cartItem._id, quantityInCart + 1)
                        )
                      }
                      className="px-6 py-3 bg-orange-500 text-white"
                    >
                      <FaPlus />
                    </button>
                  </div>

                  {/* ✅ GO TO CART BUTTON */}
                  <button
                    onClick={() => navigate("/cart")}
                    className="px-7 py-3 rounded-full border-2 border-orange-500 text-orange-500 
        font-bold hover:bg-orange-500 hover:text-white transition flex items-center gap-2"
                  >
                    <FaShoppingCart />
                    Go To Cart
                  </button>
                </>
              ) : (
                <button
                  onClick={addToCartHandler}
                  disabled={isAddingToCart}
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 
      text-white font-bold shadow-xl hover:scale-105 transition flex items-center gap-3"
                >
                  <FaShoppingCart />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ✅ MOBILE FIXED CART BAR */}
        <div className="fixed sm:hidden bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t shadow-2xl flex items-center justify-between px-4 py-3 z-50">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-lg font-bold text-orange-500">
              ₹{product.price.toFixed(2)}
            </p>
          </div>

          {!isOrderable ? (
            <div className="px-6 py-3 rounded-full bg-gray-300 text-gray-500 font-bold text-sm flex items-center gap-2">
              <FaBan /> Unavailable
            </div>
          ) : quantityInCart > 0 ? (
            <div className="flex items-center gap-2">
              {/* ✅ Quantity Controller */}
              <div className="flex items-center bg-orange-50 rounded-full overflow-hidden">
                <button
                  onClick={() =>
                    dispatch(updateQuantity(cartItem._id, quantityInCart - 1))
                  }
                  className="px-4 py-2 bg-orange-500 text-white"
                >
                  <FaMinus />
                </button>

                <span className="px-5 font-bold">{quantityInCart}</span>

                <button
                  onClick={() =>
                    dispatch(updateQuantity(cartItem._id, quantityInCart + 1))
                  }
                  className="px-4 py-2 bg-orange-500 text-white"
                >
                  <FaPlus />
                </button>
              </div>

              {/* ✅ GO TO CART BUTTON */}
              <button
                onClick={() => navigate("/cart")}
                className="px-5 py-3 rounded-full bg-white border-2 border-orange-500 
      text-orange-500 font-bold shadow"
              >
                Cart
              </button>
            </div>
          ) : (
            <button
              onClick={addToCartHandler}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 
            text-white font-bold shadow-xl flex items-center gap-2"
            >
              <FaShoppingCart />
              Add
            </button>
          )}
        </div>
      </div>
    </>
  );
}
