import HotelViewCard from '../../components/HotelViewCard';
import HotelViewCardSkeleton from '../../components/HotelViewCardSkeleton';
import EmptyHotelsState from '../../components/EmptyHotelsState';

const ResultsContainer = (props) => {
  const {
    onGetUserProfile: handleGetUserProfile,
    currentUser,
    isLoading,
    hotelsResults,
    onBookNowClick,
  } = props;

  return (
    <div className="hotels-results__container mx-2 md:mx-0 flex flex-col gap-y-2 w-full">
      {isLoading ? (
        Array.from({ length: 5 }, (_, index) => (
          <HotelViewCardSkeleton key={index} />
        ))
      ) : hotelsResults.length > 0 ? (
        hotelsResults.map((hotel) => {
          let hasWish = false
          if (currentUser?.wishlists && currentUser?.wishlists.length > 0) {
            let haslove = currentUser.wishlists.filter((item) => {
              return item.room_type_id == hotel.id
            })
            hasWish = haslove.length > 0 ? true : false
          }

          return (
            <HotelViewCard
              onGetUserProfile={handleGetUserProfile}
              currentUser={currentUser}
              hasWish={hasWish}
              onBookNowClick={onBookNowClick}
              key={hotel.id}
              id={hotel.id}
              title={hotel.name}
              image={hotel?.room_type_images[0]}
              subtitle={hotel.description}
              maxOccupancy={hotel.max_occupancy}
              bathrooms={hotel.bathrooms}
              roomSize={hotel.room_size}
              // benefits={hotel.benefits}
              rating={hotel.rating}
              price={hotel.base_price}
            />
          )

        }

        )
      ) : (
        <EmptyHotelsState />
      )}
    </div>
  );
};

export default ResultsContainer;
