export const fetchProductAndCart = async (productId, thunkAPIparam) => {
	const productResponse = await fetch(`/api/products/${productId}`);
	const product = await productResponse.json();

	return { product }
}
