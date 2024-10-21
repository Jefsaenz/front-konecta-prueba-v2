import Swal from 'sweetalert2'

const ConfirmAlerts = () => {
  return   Swal.fire({
    title: 'Error!',
    text: 'Do you want to continue',
    icon: 'error',
    confirmButtonText: 'Cool'
  })
}

export default ConfirmAlerts
