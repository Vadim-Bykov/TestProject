// import React, {createContext, useContext, useState} from 'react';
// import {useQuery} from 'react-query';
// import * as tmdbService from '../../api/tmdbService';
// import {MediaStackNavigator} from '../../Navigators/MediaStackNavigator';

// const MediaContext = createContext();

// export const useMediaContext = () => useContext(MediaContext);

// export const MediaProvider = () => {
//   const [mediaType, setMediaType] = useState('movie');
//   const [timeWindow, setTimeWindow] = useState('week');
//   const [page, setPage] = useState(1);

//   const media = useQuery(['mediaData', mediaType, timeWindow, page], () =>
//     tmdbService.getMovies({mediaType, timeWindow, page}),
//   );

//   const genres = useQuery(['genres', mediaType], () =>
//     tmdbService.getGenres(mediaType),
//   );

//   console.log('media', media.data);
//   console.log('genres', genres.data);

//   return (
//     <MediaContext.Provider
//       value={{
//         mediaType,
//         setMediaType,
//         timeWindow,
//         setTimeWindow,
//         page,
//         setPage,
//       }}>
//       <MediaStackNavigator />
//     </MediaContext.Provider>
//   );
// };
