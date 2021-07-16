import React, { useState } from 'react'

import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  Image,
} from 'react-bootstrap'
import useRouter from 'hooks/useRouter'
import { useProvideAuth } from 'hooks/useAuth'
import { LandingHeader, LoadingSpinner } from 'components'
import { setAuthToken } from 'utils/axiosConfig'
import { toast } from 'react-toastify'
import axios from 'axios'

const avatars = {
  bird: 'bird.svg',
  dog: 'dog.svg',
  fox: 'fox.svg',
  frog: 'frog.svg',
  lion: 'lion.svg',
  owl: 'owl.svg',
  whale: 'whale.svg',
  tiger: 'tiger.svg',
}

const initialState = {
  username: '',
  password: '',
  profile_image: `/${avatars.bird}`,
  isSubmitting: false,
  errorMessage: null,
}

export default function RegisterPage() {
  const [data, setData] = useState(initialState)
  const auth = useProvideAuth()
  const router = useRouter()

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.src
        ? `/${event.target.src.split('/').splice(3)}`
        : event.target.value,
    })
  }

  //file change function
  const fileChangeHandler = async (event) => {
    const uploadedAvatar = new FormData()
    uploadedAvatar.append('avatar', event.target.files[0])

    try {
      await axios
        .post(`/api/avatar/uploadAvatar`, uploadedAvatar)
        .then((res) => {
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

  const handleSignup = async (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()

    if (form.checkValidity() === false) {
    }

    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    })
    try {
      const res = await auth.signup(
        data.username,
        data.password,
        data.profile_image
      )
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: null,
      })
      setAuthToken(res.token)
      router.push('/')
    } catch (error) {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: error ? error.message || error.statusText : null,
      })
    }
  }

  return (
    <div style={{ overflow: 'auto', height: '100vh' }}>
      <LandingHeader />
      <Container className='mb-5'>
        <Row className='pt-5 justify-content-center'>
          <Form
            noValidate
            validated
            style={{ width: '350px' }}
            onSubmit={handleSignup}
          >
            <h3 className='mb-3'>Join Us!</h3>
            <Form.Group controlId='username-register'>
              <Form.Label>Username</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id='inputGroupPrepend'>@</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type='text'
                  name='username'
                  placeholder='Username'
                  aria-describedby='inputGroupPrepend'
                  required
                  value={data.username}
                  onChange={handleInputChange}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Col>
                  <Form.Label>
                    {' '}
                    Selected Avatar
                    {data.profile_image && (
                      <Image src={data.profile_image} width='120' />
                    )}
                  </Form.Label>
                </Col>
                <Col>
                  <Form.Row>
                    {data &&
                      Object.values(avatars).map((avatar) => (
                        <Image
                          name='profile_image'
                          className='col-4'
                          key={avatar}
                          src={avatar}
                          alt={avatar.split('/')}
                          onClick={handleInputChange}
                        />
                      ))}
                  </Form.Row>
                </Col>
              </Form.Row>


            {/* FILE UPLOAD HERE */}
              <input
                type='file'
                name='profile_image'
                onChange={fileChangeHandler}
              />
            {/* ^^^^^^^^ FILE UPLOAD ABOVE ^^^^^^^^ */}


            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor='Register'>Password</Form.Label>
              <Form.Control
                type='password'
                name='password'
                required
                id='inputPasswordRegister'
                value={data.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            {data.errorMessage && (
              <span className='form-error text-warning'>
                {data.errorMessage}
              </span>
            )}
            <Row className='mr-0'>
              <Col>
                Already Registered?
                <Button
                  as='a'
                  variant='link'
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
              </Col>
              <Button type='submit' disabled={data.isSubmitting}>
                {data.isSubmitting ? <LoadingSpinner /> : 'Sign up'}
              </Button>
            </Row>
          </Form>
        </Row>
      </Container>
    </div>
  )
}