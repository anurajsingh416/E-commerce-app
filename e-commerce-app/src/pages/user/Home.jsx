import NavBar from "../../components/NavBar";
import Banner from "../../components/Banner";
import ProductList from "../../components/ProductList";
import Cart from "../../components/Cart";
export default function Home(){
    return (
        <div>
            
            <Banner />
            <ProductList />
            <Cart />
        </div>
    );
};
