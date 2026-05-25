import { appPromoBannerData, assets } from "../../assets/assets";

const AddPromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 my-14 bg-green-950 rounded-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 xl:px-10">
        {/* Left side content */}
        <div className="text-center md:text-left">
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3">
            {appPromoBannerData.title}
          </h2>
          <p className="text-white/70 mb-6 max-w-md">
            {appPromoBannerData.description}
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-6">
            <button className="bg-white hover:bg-orange-100 text-green-950 font-semibold py-2 px-4 rounded-xl">
              App Store
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-xl transition-colors border border-white/20">
              Google Play
            </button>
          </div>
        </div>

        {/* Right side image */}
        <img
          src={assets.delivery_truck}
          alt="App Promo"
          className="max-w-60 sm:max-w-120 xl:pr-10"
        />
        
      </div>
    </section>
  );
};

export default AddPromoBanner;
