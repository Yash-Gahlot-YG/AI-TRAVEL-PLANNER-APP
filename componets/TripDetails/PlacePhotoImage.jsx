import React, { useEffect, useState } from "react";
import { Image, ActivityIndicator } from "react-native";
import {
  fetchPlacePhotoByName,
  fetchPlacePhotoDataUri,
  isValidImageUrl,
} from "../../services/GooglePlaceApi";
import { Colors } from "@/constants/Colors";

const NO_IMAGE = require("../../assets/images/NoImage1.webp");

const PlacePhotoImage = ({
  name,
  locationHint,
  address,
  imageUrl,
  photoRef,
  staggerIndex = 0,
  style,
  loaderStyle,
}) => {
  const [source, setSource] = useState(NO_IMAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (staggerIndex > 0) {
        await new Promise((r) => setTimeout(r, staggerIndex * 350));
      }
      if (cancelled) return;

      setLoading(true);

      if (isValidImageUrl(imageUrl)) {
        if (!cancelled) {
          setSource({ uri: imageUrl.trim() });
          setLoading(false);
        }
        return;
      }

      if (photoRef?.startsWith("places/")) {
        const dataUri = await fetchPlacePhotoDataUri(photoRef);
        if (!cancelled) {
          setSource(dataUri ? { uri: dataUri } : NO_IMAGE);
          setLoading(false);
        }
        return;
      }

      const { photoDataUri, photoUrl } = await fetchPlacePhotoByName(
        name,
        locationHint,
        address
      );

      if (cancelled) return;

      if (photoDataUri) {
        setSource({ uri: photoDataUri });
      } else if (photoUrl) {
        setSource({ uri: photoUrl });
      } else {
        setSource(NO_IMAGE);
      }
      setLoading(false);
    };

    if (name || photoRef) {
      load();
    } else {
      setSource(NO_IMAGE);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [name, locationHint, address, imageUrl, photoRef, staggerIndex]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.PRIMARY}
        style={loaderStyle || style}
      />
    );
  }

  return (
    <Image
      source={source}
      style={style}
      onError={() => setSource(NO_IMAGE)}
    />
  );
};

export default PlacePhotoImage;
