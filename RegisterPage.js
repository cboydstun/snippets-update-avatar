import React, { useState } from 'react'

//import bootstrap components
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  Image,
} from 'react-bootstrap'

//import hooks
import useRouter from 'hooks/useRouter'
import { useProvideAuth } from 'hooks/useAuth'

//import components
import { LandingHeader, LoadingSpinner } from 'components'

//import utilties
import { setAuthToken } from 'utils/axiosConfig'

//set avatars
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

//set initial state
const initialState = {
  username: '',
  password: '',
  profile_image: `/${avatars.bird}`,
  isSubmitting: false,
  errorMessage: null,
}

export default function RegisterPage() {
  //slice of state
  const [data, setData] = useState(initialState)
  //context
  const auth = useProvideAuth()
  //router
  const router = useRouter()

  //function to handle data change
  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.src
        ? `/${event.target.src.split('/').splice(3)}`
        : event.target.value,
    })
  }

  //function to handle register
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

    //perform async action with trycatch block
    try {
      const res = await auth.signup(data.username, data.password, data.profile_image)
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

  //render
  return (
    <div style={{overflow: "auto", height: "100vh"}}>
      <LandingHeader/>
      <Container className='mb-5'>
        <Row className='pt-5 justify-content-center'>
            <Form
                noValidate
                validated
                style={{ width: '350px' }}
                onSubmit={handleSignup}
            >
                <h3 className="mb-3">Join Us!</h3>
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

                {/* AVATAR SELECTOR */}
                <Form.Group>
                  <Form.Row>
                    <Col>
                      <Form.Label> Selected Avatar
                      {data.profile_image && (
                        <Image src={data.profile_image} width='120' thumbnail />
                      )}
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Row>
                      { data &&
                        Object.values(avatars).map(avatar => 
                          <Image
                          name='profile_image'
                          className='col-4'
                          key={avatar}
                          src={avatar}
                          alt={avatar.split('/')}
                          onClick={handleInputChange}
                          thumbnail
                          /> 
                        )
                      }
                      </Form.Row>
                    </Col>
                  </Form.Row>
                </Form.Group>

                {data.errorMessage && (
                <span className='form-error text-warning'>{data.errorMessage}</span>
                )}
                <Row className='mr-0'>
                <Col>
                    Already Registered?
                    <Button
                    as='a'
                    variant='link'
                    onClick={() => router.push("/login")}
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