import 'bootstrap/dist/css/bootstrap.css';
import './styles/main.scss';
import { initInputValidation, initSearchButton } from './js/form-validation';
import { initTabs } from './js/tabs';

(function init() {
  initInputValidation();
  initSearchButton();
  initTabs();
})();
