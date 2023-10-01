import React, { useState, useEffect } from "react";
import axios from "axios"

function Content() {

    /**
     * Author: Aravind
     * desc: Get data from mongodb
     */
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    // useEffect(() => {
    const getData = () => {
        axios.get('http://localhost:3001/get')
            .then((res) => {
                console.log(res.data);
                setData(res.data);
            })
    };
    // }, []);

    /**
     * Author: Aravind
     * desc: Post data to mongodb
     */
    const [postData, setPostData] = useState({
        firstName: "",
        lastName: "",
        number: ""
    });
    console.log(postData);

    const handleChange = (e) => {
        const value = e.target.value;
        console.log(value);
        setPostData({
            ...postData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            firstName: postData.firstName,
            lastName: postData.lastName,
            number: postData.number
        }
        try {
            axios.post("http://localhost:3001", userData)
                .then((res) => {
                    console.log(res);
                    getData();
                    setPostData({
                        firstName: "",
                        lastName: "",
                        number: "",
                    })
                })
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            {/* button for Add contacts
            <!-- Button trigger modal --> */}
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Add Contacts
            </button>

            {/* <!-- Modal --> */}
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Add Contacts</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form action="" onSubmit={handleSubmit}>
                                <div className="input_row">
                                    <label htmlFor="">FirstName:</label>
                                    <input type="text" name="firstName" value={postData.firstName} onChange={handleChange} placeholder="FirstName" />
                                </div>
                                <div className="input_row">
                                    <label htmlFor="">LastName:</label>
                                    <input type="text" name="lastName" value={postData.lastName} onChange={handleChange} placeholder="LastName" />
                                </div>
                                <div className="input_row">
                                    <label htmlFor="">Number:</label>
                                    <input type="text" name="number" value={postData.number} onChange={handleChange} placeholder="Phone Number" />
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" class="btn btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* MODAL END */}

            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">0</th>
                        <th scope="col">FirstName</th>
                        <th scope="col">LastName</th>
                        <th scope="col">Number</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data && Array.isArray(data) ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.number}</td>
                                <td>
                                    <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button>
                                    <button type="button" className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No content</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Content;