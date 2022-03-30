import React, { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../components/Logo";
import Post from "../components/Post";
import Navigation2 from "../components/Navigation2";

const Groupomania = () => {
    const [forumData, setForumData] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [error, setError] = useState(false);
    const storedJwt = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');


    const getData = () => {
        axios
            .get('http://localhost:3008/api/post/', {
                headers: {
                    'Authorization': `Bearer ${storedJwt}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => setForumData(res.data))
            .catch((err) => {
                console.error(err)
            })
    };

    const updatePost = () => {
        setForumData(updatedPost)
    };

    useEffect(() => getData(), []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (content.length < 1) {
            setError(true);
        } else {
            // const formData = new FormData();
            // formData.append("attachment", attachment);
            // formData.append("title", title);
            // formData.append("title", content);
            axios
                .post("http://localhost:3008/api/post/",
                    {
                        post: {
                            title: title,
                            content: content,
                            attachment: attachment,
                        }
                    }
                    ,
                    {
                        headers: {
                            'Authorization': `Bearer ${storedJwt}`
                            //'Content-Type': 'multipart/form-data'
                            // 'Content-Type': 'application/json'
                        }
                    })
                .then(() => getData());
            setError(false);
            setContent("");


        }
    };

    return (
        <div className="forum-container">
            <Logo />
            <Navigation2 />
            <h1>Fil d’actualité</h1>
            <form className="forum-container__Form" onSubmit={(e) => handleSubmit(e)}>
                <input
                    placeholder="Titre..."
                    className="forum-container__Form--title"
                    type='text'
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <textarea
                    className="forum-container__Form--content"
                    style={{ border: error ? "1px solid red" : "1px solid #52cdfa" }}
                    placeholder="Exprimez vous :)"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                ></textarea>
                <input className="forum-container__Form--file" type="file" name="fileToUpload" onChange={(e) => setAttachment(e.target.files[0])} />
                {error && <p>Veuillez écrire un minimum de 5 caractères</p>}
                <input className="forum-container__Form--submit" type="submit" value="Poster" />
            </form>
            <div>
                {forumData
                    .sort((a, b) => b.date - a.date)
                    .map((post) => (
                        <Post key={post.id} post={post} storedJwt={storedJwt} getData={getData} comments={post.comments} updatePost={updatePost} />
                    ))
                }
            </div>

        </div>
    );
};


export default Groupomania;