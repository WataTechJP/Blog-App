const Footer = () => {
    return (
        <div className="min-w-full bottom-0 bg-gray-600 text-base text-center p-1">
            <div className="text-xl">
            <h1>Contact to me from here!</h1>
            </div>
          <div className="my-1 flex justify-center items-center space-x-4">
            <a
              href="mailto:wattech3371@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white cursor-pointer">
            <img src="../../../public/icons/email.svg" alt="" width={50} height={50}/>
            </a>
            <a
              href="https://www.linkedin.com/in/wataru-okada-509319334"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white cursor-pointer">
            <img src="../../../public/icons/linkedin.svg" alt=""  width={50} height={50}/>
            </a>
            <a
              href="https://github.com/WataTechJP"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <img src="../../../public/icons/github.svg" alt=""  width={50} height={50}/>
            </a>
            <a
              href="https://www.instagram.com/6crazyinsane9/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <img src="../../../public/icons/instagram.svg" alt=""  width={50} height={50}/>
            </a>
            <a
              href="https://www.facebook.com/okada.wataru.79"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
                <img src="../../../public/icons/facebook.svg" alt=""  width={50} height={50}/>
            </a>
          </div>
          <hr className="mx-20 my-2" />
          <p>&copy; 2025 Wataru Okada. All rights reserved.</p>
        </div>
    );
}

export default Footer;