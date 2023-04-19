/* eslint-disable react/no-unescaped-entities */
import React, { useContext } from 'react'
import { UrlContext } from '../helpers/UrlContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

function Registration() {
  const { urlPath } = useContext(UrlContext)
 let navigate = useNavigate()

 const initialValues = {
  username: '',
  email: '',
  password: ''
 }
 const validationSchema = Yup.object().shape({
  username: Yup.string().required('Le champ Auteur doit être rempli'),
  email: Yup.string().email().required('Le champ Email doit être rempli'),
  password: Yup.string()
   .required('Le champ Mot de passe doit être rempli')
   .min(10, 'Le champ Mot de passe doit comporter au moins dix caractères')
   .max(20, 'Le champ Mot de passe doit comporter moins de vingt caractères')
   .test(
    'isValidPass',
    'Le champ Mot de passe doit comporter au moins une majuscule, une minuscule, un chiffre et caractère spécial',
    (value) => {
     const hasUpperCase = /[A-Z]/.test(value)
     const hasLowerCase = /[a-z]/.test(value)
     const hasNumber = /[0-9]/.test(value)
     const hasSymbole = /[!@#%&]/.test(value)
     let validConditions = 0
     const numberOfMustBeValidConditions = 4
     const conditions = [hasLowerCase, hasUpperCase, hasNumber, hasSymbole]
     conditions.forEach((condition) => (condition ? validConditions++ : null))
     if (validConditions >= numberOfMustBeValidConditions) {
      return true
     }
     return false
    }
   )
  //yup__WEBPACK_IMPORTED_MODULE_2
  /*.minLowercase(
    1,
    'Le champ Mot de passe doit comporter au moins une minuscule'
   )
   .minUppercase(
    1,
    'Le champ Mot de passe doit comporter au moins une majuscule'
   )
   .minNumbers(1, 'Le champ Mot de passe doit comporter au moins un chiffre')
   .minSymbols(
    1,
    'Le champ Mot de passe doit comporter au moins un caractère spécial'
   )*/
 })

 const onSubmit = (data) => {
 // console.log('urlPath', urlPath)
  axios
   .post(`${urlPath}/auth`, data)
   .then(() => {
    navigate('/login')
   })
   .catch((response) => {
    document.getElementById('message').innerHTML = response.response.data.error
   })
 }
 return (
  <div className="pt-5">
   <Formik
    initialValues={initialValues}
    onSubmit={onSubmit}
    validationSchema={validationSchema}
   >
    <Form className="d-flex flex-column shadow bg-body rounded form">
     <div className="bg-moyen text-white text-center">
      <h4 className="fw-bold">Inscription</h4>
     </div>
     <div className="d-flex">
      <label className="col-3 bg-moyen text-white fw-bold text-end pe-2">
       Nom d'utilisateur
      </label>
      <Field
       className="form-control"
       autoComplete="off"
       name="username"
       placeholder="Nom d'utilisateur"
      />
     </div>
     <div className="d-flex">
      <label className="col-3 bg-moyen text-white fw-bold text-end pe-2">
       Email
      </label>
      <Field
       className="form-control"
       autoComplete="off"
       type="email"
       name="email"
       placeholder="Email"
      />
     </div>
     <div className="d-flex">
      <label className="col-3 bg-moyen text-white fw-bold text-end pe-2">
       Mot de passe
      </label>
      <Field
       className="form-control"
       autoComplete="off"
       type="password"
       name="password"
       placeholder="Mot de passe"
      />
     </div>

     <div id="message" className="text-danger fw-bold text-center">
      <ErrorMessage name="username" component="span" />
      <ErrorMessage name="email" component="span" />
      <ErrorMessage name="password" component="span" />
     </div>
     <button type="submit" className="btn btn-success btn-noradius fw-bold">
      Valider
     </button>
    </Form>
   </Formik>
  </div>
 )
}

export default Registration
