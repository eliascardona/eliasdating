import { auth } from "../../lib/sdk/firebase";
import { signOut } from "firebase/auth";
// import { useRouter } from "next/router";
import "../../assets/css/pageheader.css"

export const PageHeader = () => {
  // const router = useRouter()
  return (
    <>
      <header className="headerStyles">
        <div>
          <span className="linkStyle" onClick={() => redirect(`${window.location.origin}`)}>
            <span className="text">
              DATE UN
            </span>
            {" "}
            <span className="font">
              DATE
            </span>
          </span>
        </div>
        <div>
          <h4 onClick={() => signOut(auth)}>
            <ion-icon name="exit-outline"></ion-icon>
          </h4>
        </div>
      </header>
    </>
  );
};
