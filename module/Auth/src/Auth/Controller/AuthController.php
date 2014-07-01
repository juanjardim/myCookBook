<?php
namespace Auth\Controller;

use ScnSocialAuth\Controller\UserController;
use Zend\Form\Form;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Stdlib\Parameters;
use Zend\View\Model\ViewModel;
use ZfcUser\Options\UserControllerOptionsInterface;
use ZfcUser\Service\User as UserService;

class AuthController extends AbstractActionController{

    /**
     * @var Form
     */
    protected $registerForm;

    /**
     * @var UserService
     */
    protected $userService;

    /**
     * @var UserControllerOptionsInterface
     */
    protected $options;

    public function loginAction() {
        if ($this->zfcUserAuthentication()->hasIdentity()) {
            return $this->redirect()->toRoute($this->getOptions()->getLoginRedirectRoute());
        }

        // todo make as register form
        return new ViewModel();
    }

    public function registerAction() {
        if ($this->zfcUserAuthentication()->hasIdentity()) {
            return $this->redirect()->toRoute($this->getOptions()->getLoginRedirectRoute());
        }

        $form = $this->getRegisterForm();
        $service = $this->getUserService();
        $request = $this->getRequest();
        if ($request->isPost()) {
            $form->setData($request->getPost());
            if ($form->isValid()) {
                $data = $form->getData();
                $user = $service->register($data);
                if ($user) {
                    $identityFields = $service->getOptions()->getAuthIdentityFields();
                    if (in_array('email', $identityFields)) {
                        $post['identity'] = $user->getEmail();
                    } elseif (in_array('username', $identityFields)) {
                        $post['identity'] = $user->getUsername();
                    }
                    $post['credential'] = $data['password'];
                    $request->setPost(new Parameters($post));
                    return $this->forward()->dispatch('zfcuser', array('action' => 'authenticate'));
                }
            }
        }

        return array(
            'registerForm' => $form,
        );
    }


    //todo: check if there is any user ou e-mail in the database through ajax


    public function getRegisterForm()
    {
        if (!$this->registerForm) {
            $this->setRegisterForm($this->getServiceLocator()->get('zfcuser_register_form'));
        }
        return $this->registerForm;
    }

    public function setRegisterForm(Form $registerForm)
    {
        $this->registerForm = $registerForm;
    }

    public function getUserService()
    {
        if (!$this->userService) {
            $this->userService = $this->getServiceLocator()->get('zfcuser_user_service');
        }
        return $this->userService;
    }

    public function setUserService(UserService $userService)
    {
        $this->userService = $userService;
        return $this;
    }

    /**
     * get options
     *
     * @return UserControllerOptionsInterface
     */
    public function getOptions()
    {
        if (!$this->options instanceof UserControllerOptionsInterface) {
            $this->setOptions($this->getServiceLocator()->get('zfcuser_module_options'));
        }
        return $this->options;
    }


    /**
     * set options
     *
     * @param UserControllerOptionsInterface $options
     * @return UserController
     */
    public function setOptions(UserControllerOptionsInterface $options)
    {
        $this->options = $options;
        return $this;
    }


} 