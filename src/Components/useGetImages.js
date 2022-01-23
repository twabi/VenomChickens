import { useState, useEffect } from "react";
import Firebase from "./Firebase";


var storageRef = Firebase.storage().ref("/");
export const useGetImages = (filePath) => {
    const [error, setError] = useState(null);
    const [images, setImages] = useState(null);

    // runs every time the file value changes
    useEffect(() => {
        if (filePath) {
            // storage ref
            var tempArray = [];
            storageRef.child(filePath).listAll()
                .then((res) => {
                    res.items.forEach((itemRef) => {
                        // All the items under listRef.
                        //console.log(itemRef.name);
                        itemRef.getDownloadURL()
                            .then((url) => {
                                // `url` is the download URL for 'images/stars.jpg'
                                //console.log(url);
                                var name = "";
                                if(itemRef.name.includes(".jpg")) {
                                    name = itemRef.name.replace(".jpg", "")
                                    //console.log(name);
                                } else {
                                    name = itemRef.name
                                }
                                //console.log(name)
                                tempArray.push({name: name, url: url});
                                //console.log(tempArray);
                                setImages([...tempArray])
                            })
                            .catch((error) => {
                                // Handle any errors
                            });
                        //console.log(tempArray);
                        setImages([...tempArray])
                    });
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                    setError(error);
            });
        }
    }, [filePath]);

    return { images, error };
};
