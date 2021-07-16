import React, { useState, useEffect } from 'react'

//import bootstrap components
import {
  Container,
  Card,
  Form,
  Button,
  Figure,
  Col,
  Image,
} from 'react-bootstrap'

//import components
import { LoadingSpinner, Post } from 'components'

//import hooks
import { useProvideAuth } from 'hooks/useAuth'
import { useRequireAuth } from 'hooks/useRequireAuth'

//import libraries
import axios from 'utils/axiosConfig.js'
import { toast } from 'react-toastify'

//set avatars
const avatars = {
  bird: '../../bird.svg',
  dog: '../../dog.svg',
  fox: '../../fox.svg',
  frog: '../../frog.svg',
  lion: '../../lion.svg',
  owl: '../../owl.svg',
  whale: '../../whale.svg',
  tiger: '../../tiger.svg',
}

//main export function
export default function UserDetailPage({
  match: {
    params: { uid },
  },
  history,
}) {
    //initial state
  const { state } = useProvideAuth()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [validated, setValidated] = useState(false)
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({
    password: '',
    profile_image: '',
    isSubmitting: false,
    errorMessage: null,
  })
  const {
    state: { isAuthenticated },
  } = useRequireAuth()
  const { signout } = useProvideAuth()

  //file change function
  const fileChangeHandler = async (event) => {
    const uploadedAvatar = new FormData()
    uploadedAvatar.append('avatar', event.target.files[0])

    try {
      await axios.post(`/avatar/uploadAvatar`, uploadedAvatar).then((res) => {
        setData({
          ...data,
          profile_image: `/${res.data.split('\\')[3]}`,
        })
      })
      toast.success('Avatar uploaded successfully.', {
        autoClose: 2000,
      })
    } catch (error) {
      toast.error('Avatar upload failed.', {
        autoClose: 2000,
      })
    }
  }

  //axios fetch
  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await axios.get(`users/${uid}`)
        setUser(userResponse.data)
        setLoading(false)
      } catch (err) {
        console.error(err.message)
      }
    }
    isAuthenticated && getUser()
  }, [uid, isAuthenticated])

  //update data if a picture is involved, if not then just use default value
  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.src
        ? `/${event.target.src.split('/').splice(3)}`
        : event.target.value,
    })
  }

  //update avatar function
  const handleUpdateAvatar = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })
    try {
      // write code to call edit user endpoint 'users/:id'
      const {
        user: { uid, username },
      } = state
      await axios.put(`users/${uid}`, {
        profile_image: data.profile_image,
      })
      setValidated(false)
      // don't forget to update loading state and alert success
      setData({
        ...data,
        isSubmitting: false,
      })
      toast.success('Avatar updated successfully.', {
        autoClose: 2000,
      })
    } catch (error) {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error.message,
      })
    }
  }

  //update password
  const handleUpdateAccount = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const form = event.currentTarget
    // handle invalid or empty form
    if (form.checkValidity() === false) {
      setValidated(true)
      return
    }
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })
    try {
      // write code to call edit user endpoint 'users/:id'
      const {
        user: { uid, username },
      } = state
      await axios.put(`users/${uid}`, {
        password: data.password,
        profile_image: data.profile_image,
      })
      setValidated(false)
      // don't forget to update loading state and alert success
      setData({
        ...data,
        isSubmitting: false,
      })
      toast.success('Acount updated successfully.', {
        autoClose: 2000,
      })
      signout()
    } catch (error) {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error.message,
      })
    }
  }

  if (!isAuthenticated) {
    return <LoadingSpinner full />
  }

  if (loading) {
    return <LoadingSpinner full />
  }

  return (
    <>
      <Container className='clearfix'>
        <Button
          variant='outline-info'
          onClick={() => {
            history.goBack()
          }}
          style={{ border: 'none', color: '#E5E1DF' }}
          className='mt-3 mb-3'
        >
          Go Back
        </Button>
        <Card bg='header' className='text-center'>
          <Card.Body>
            <Figure
              className='bg-border-color rounded-circle overflow-hidden my-auto ml-2 p-1'
              style={{
                height: '50px',
                width: '50px',
                backgroundColor: 'white',
              }}
            >
              <Figure.Image src={user.profile_image} className='w-100 h-100' />
            </Figure>
            <Card.Title>{uid}</Card.Title>
            {state.user.username === uid && (
              <div
                onClick={() => {
                  setData({
                    ...data,
                    profile_image: user.profile_image,
                  })
                  setOpen(!open)
                }}
                style={{ cursor: 'pointer', color: '#BFBFBF' }}
              >
                Update Account
              </div>
            )}
            {open && (
              <Container animation='false'>
                <div className='row justify-content-center p-4'>
                  <div className='col text-center'>
                    <Form onSubmit={handleUpdateAvatar}>
                      <Form.Group>
                        <Form.Row>
                          <Col>
                            <Form.Label>
                              {' '}
                              Selected Avatar
                              <Col>
                                {data.profile_image && (
                                  <Image src={data.profile_image} thumbnail style={{height: "10rem"}} />
                                )}
                              </Col>
                            </Form.Label>
                          </Col>
                          <Col>
                            <Form.Row>
                              {user &&
                                Object.values(avatars).map((avatar) => (
                                  <Image
                                    name='profile_image'
                                    className='col-3'
                                    key={avatar}
                                    src={avatar}
                                    alt={avatar.split('/')}
                                    onClick={handleInputChange}
                                    thumbnail
                                  />
                                ))}
                            </Form.Row>
                          </Col>
                        </Form.Row>
                      </Form.Group>
                      {data.errorMessage && (
                        <span className='form-error'>{data.errorMessage}</span>
                      )}

                      
                        {/* FILE UPLOAD HERE */}
                        <input
                          type='file'
                          name='profile_image'
                          onChange={fileChangeHandler}
                          placeholder="Click"
                        />
                        {/* ^^^^^^^^ FILE UPLOAD ABOVE ^^^^^^^^ */}
                      
                      <Button type='submit' disabled={data.isSubmitting}>
                        {data.isSubmitting ? (
                          <LoadingSpinner />
                        ) : (
                          'Update Avatar'
                        )}
                      </Button>
                    </Form>

                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleUpdateAccount}
                    >
                      <Form.Group>
                        <Form.Label htmlFor='password'>New Password</Form.Label>
                        <Form.Control
                          type='password'
                          name='password'
                          required
                          value={data.password}
                          onChange={handleInputChange}
                        />
                        <Form.Control.Feedback type='invalid'>
                          New Password is required
                        </Form.Control.Feedback>
                        <Form.Text id='passwordHelpBlock' muted>
                          Must be 8-20 characters long.
                        </Form.Text>
                      </Form.Group>
                      {data.errorMessage && (
                        <span className='form-error'>{data.errorMessage}</span>
                      )}
                      <Button type='submit' disabled={data.isSubmitting}>
                        {data.isSubmitting ? (
                          <LoadingSpinner />
                        ) : (
                          'Update Account'
                        )}
                      </Button>
                    </Form>
                  </div>
                </div>
              </Container>
            )}
          </Card.Body>
        </Card>
      </Container>
      <Container className='pt-3 pb-3'>
        {user.posts.length !== 0 ? (
          user.posts.map((post) => (
            <Post key={post._id} post={post} userDetail />
          ))
        ) : (
          <div
            style={{
              marginTop: '75px',
              textAlign: 'center',
            }}
          >
            No User Posts
          </div>
        )}
      </Container>
    </>
  )
}