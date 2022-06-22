import { Component, OnInit } from '@angular/core';
import { Contacto } from '../../models/contacto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactosService } from '../../services/contactos.service';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css'],
})
export class ContactosComponent implements OnInit {
  curso = '4K2';
  Titulo = 'Contactos';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Buscar)',
    L: '(Listado)',
    C: '(Consultar)',
  };
  AccionABMC = 'L';

  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...',
  };

  Contactos: Contacto[] = null;

  submitted = false;

  FormBusqueda = new FormGroup({
    Nombre: new FormControl(null),
    Activo: new FormControl(null),
  });

  FormRegistro = new FormGroup({
    IdContacto: new FormControl(0),
    Nombre: new FormControl('', [
      Validators.required,
      Validators.maxLength(55),
    ]),

    FechaNacimiento: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
      ),
    ]),
    Telefono: new FormControl(null, [
      Validators.required,
      Validators.pattern('[0-9]{1,9}'),
      Validators.maxLength(9)
    ]),
    IdCategoria: new FormControl(0),
  });

  constructor(
    private contactosService: ContactosService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {}

  GetContactos() {
    this.contactosService.get().subscribe((res: Contacto[]) => {
      this.Contactos = res;
    });
  }

  Buscar() {
    this.contactosService.get().subscribe((res: Contacto[]) => {
      this.Contactos = res;
    });
  }

  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ IdContacto: 0 });
    this.submitted = false;
    //this.FormRegistro.markAsPristine();  // incluido en el reset
    //this.FormRegistro.markAsUntouched(); // incluido en el reset
  }
  Volver() {
    this.AccionABMC = 'L';
  }

  
  


  BuscarPorId(Contacto, AccionABMC) {
   // ir al incio del scroll

    this.contactosService.getById(Contacto.IdContacto).subscribe((res: any) => {
      this.FormRegistro.patchValue(res);

      //formatear fecha de  ISO 8061 a string dd/MM/yyyy
      var arrFecha = res.FechaNacimiento.substr(0, 10).split('-');
      this.FormRegistro.controls.FechaNacimiento.patchValue(
        arrFecha[2] + '/' + arrFecha[1] + '/' + arrFecha[0]
      );

      this.AccionABMC = AccionABMC;
    });
  }


  Consultar(Contacto){
    this.BuscarPorId(Contacto,'C')
  }

  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaNacimiento.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.FechaNacimiento = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == 'A') {
      this.contactosService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    }
  }

}

