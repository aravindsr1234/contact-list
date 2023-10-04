import React, { useState, useEffect } from "react";
import axios from "axios"

function Content() {

    /**
     * Author: Aravind
     * desc: Get data from mongodb
     */
    const [data, setData] = useState([]);
    console.log(data);
    const [length, setLength] = useState([]);
    console.log(length);

    useEffect(() => {
        getData();
    }, []);

    // let currentPage = 1;
    const [currentPage, setCurrentPage] = useState(1);
    let itemsPerPage = 10;

    const getData = () => {
        axios.get('http://localhost:3001/get', {
            params: {
                page: currentPage,
                limit: itemsPerPage,
            }
        })
            .then((res) => {
                console.log(res.data);
                setData(res.data.data);
                setLength(res.data.length);
            })
    };

    /**
     * Author: Aravind
     * desc: Post data to mongodb
     */
    const [postData, setPostData] = useState({
        firstName: "",
        lastName: "",
        number: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const value = e.target.value;
        const inputName = e.target.name;
        console.log(value);
        setPostData({
            ...postData,
            [inputName]: value
        });

        const updatedErrors = { ...errors };
        if (inputName === 'firstName') {

            const pattern = /^[a-zA-Z]+$/;
            updatedErrors.firstName = !pattern.test(value)
                ? 'First name should only contain letters'
                : '';
        } else if (inputName === 'lastName') {

            const pattern = /^[a-zA-Z0-9]+$/;
            updatedErrors.lastName = !pattern.test(value)
                ? 'Last name should contain letters and numbers only'
                : '';
        } else if (inputName === 'number') {

            const pattern = /^[0-9]+$/;
            updatedErrors.number = !pattern.test(value)
                ? 'Number should contain numbers only'
                : '';
        }
        setErrors(updatedErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!errors.firstName && !errors.lastName && !errors.number) {

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
        } else {
            console.log('Please correct the form errors.');
        }
    };

    /**
     * Author: Aravind
     * desc: edit data in the mongodb
     */
    const getEditData = (id) => {
        axios.get(`http://localhost:3001/get/?id=${id}`)
            .then(response => {
                console.log("get data to edit", response);
                setPostData({ ...postData, firstName: response.data.firstName, lastName: response.data.lastName, number: response.data.number, id: response.data._id });
            })
    }

    const editData = (id) => {
        axios.put(`http://localhost:3001/update/?id=${id}`, postData)
            .then(response => {
                console.log("update", response);
                getData();
                setPostData({
                    firstName: "",
                    lastName: "",
                    number: "",
                })
            })
    }

    /**
     * Author: Aravind
     * desc: delelte data in the mongodb
     */
    const deleteData = (id) => {
        axios.delete(`http://localhost:3001/delete/?id=${id}`)
            .then(response => {
                console.log("delete", response);
                getData();
            })
    }

    /**
     * Author: Aravind
     * desc: search data in the mongodb
     */
    const [searched, setSearched] = useState({});
    console.log(searched);
    const search = (e) => {
        const query = e.target.value;
        console.log(query);
        setSearched(query)
    }

    useEffect(() => {
        enter();
    }, [])
    const enter = () => {
        axios.get(`http://localhost:3001/search/?term=${searched}`)
            .then((res) => {
                console.log(res.data)
                if (res.data.length !== 0) {
                    setData(res.data);
                } else {
                    getData();
                }
            })
    }

    const page = (page) => {
        axios.get(`http://localhost:3001/get/?page=${page}`)
            .then((res) => {
                // currentPage = page;
                setCurrentPage(page);
                console.log(res.data.data);
                setData(res.data.data);
            })
    }

    const renderPaginationButtons = () => {
        const buttons = [];
        const totalPages = Math.ceil(length / 10);
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <li
                        key={i}
                        className={`page-item ${currentPage === i ? 'active' : ''}`}
                    >
                        <a
                            className="page-link"
                            href="#"
                            onClick={() => page(i)}
                        >
                            {i}
                        </a>
                    </li>
                );
            }
        }
        return buttons;
    };

    return (
        <div className="container">
            <div className="forAdd">
                {/* button for Add contacts
            <!-- Button trigger modal --> */}
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Add Contacts
                </button>

                {/* <!-- Add Modal --> */}
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
                                        {errors.firstName && <div className="error" style={{ color: 'red' }}>{errors.firstName}</div>}
                                    </div>
                                    <div className="input_row">
                                        <label htmlFor="">LastName:</label>
                                        <input type="text" name="lastName" value={postData.lastName} onChange={handleChange} placeholder="LastName" />
                                        {errors.lastName && <div className="error" style={{ color: 'red' }}>{errors.lastName}</div>}
                                    </div>
                                    <div className="input_row">
                                        <label htmlFor="">Number:</label>
                                        <input type="text" name="number" value={postData.number} onChange={handleChange} placeholder="Phone Number" />
                                        {errors.number && <div className="error" style={{ color: 'red' }}>{errors.number}</div>}
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
                {/* Add MODAL END */}

                <div>
                    <input type="search" placeholder="Search" onChange={search} onKeyDown={enter} />
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
            </div>

            {/* <!-- Edit Modal --> */}
            <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Add Contacts</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form action="">
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
                                    <button type="button" class="btn btn-primary" onClick={() => { editData(postData.id) }}>Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Edit MODAL END */}


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
                                    <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => getEditData(item._id)}>edit</button>
                                    <button type="button" className="btn btn-danger" onClick={() => { deleteData(item._id) }}>Delete</button>
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

            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    {/* <li class="page-item"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#" onClick={ ()=>{page(2)}}>2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li> */}

                    {renderPaginationButtons()}
                </ul>
            </nav>

        </div>
    )
}

export default Content;